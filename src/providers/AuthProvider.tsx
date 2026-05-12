'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { configureApiAuth, setAccessTokenMemory } from '@/lib/api/token';
import * as authApi from '@/services/auth.service';
import type { AuthMeResponseDto, RegisterRequest } from '@/types/auth-contract';
import type { BackendApiResponse } from '@/types/api';
import { persistTokens, clearStoredTokens, readStoredAccessToken } from '@/stores/auth/storage';
import { setAuthHintCookie, clearAuthHintCookie } from '@/stores/auth/sessionCookie';

export type AuthResult = { ok: true } | { ok: false; message: string };

type AuthContextValue = {
  user: AuthMeResponseDto | null;
  isInitialized: boolean;
  isBusy: boolean;
  loginWithPassword: (email: string, password: string) => Promise<AuthResult>;
  registerAccount: (payload: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiError(result: BackendApiResponse): string {
  if (result.success) {
    return 'Invalid response from server';
  }
  return result.error?.message ?? result.error?.code ?? 'Something went wrong';
}

function loginUserToMeShape(loginUser: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt?: string | null;
}): AuthMeResponseDto {
  return {
    id: loginUser.id,
    email: loginUser.email,
    firstName: loginUser.firstName,
    lastName: loginUser.lastName,
    role: loginUser.role,
    status: loginUser.status,
    emailVerified: loginUser.emailVerified,
    lastLoginAt: loginUser.lastLoginAt ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthMeResponseDto | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const clearSession = useCallback(() => {
    clearStoredTokens();
    clearAuthHintCookie();
    setAccessTokenMemory(null);
    setUser(null);
  }, []);

  useEffect(() => {
    configureApiAuth({
      getAccessToken: () => readStoredAccessToken(),
    });

    const token = readStoredAccessToken();
    if (!token) {
      setIsInitialized(true);
      return;
    }

    void (async () => {
      const me = await authApi.fetchCurrentUser(token);
      if (me.success && me.data) {
        setUser(me.data);
        setAccessTokenMemory(token);
        setAuthHintCookie();
      } else {
        clearSession();
      }
      setIsInitialized(true);
    })();
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    const token = readStoredAccessToken();
    if (!token) {
      clearSession();
      return;
    }
    const me = await authApi.fetchCurrentUser(token);
    if (me.success && me.data) {
      setUser(me.data);
    } else {
      clearSession();
    }
  }, [clearSession]);

  const loginWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setIsBusy(true);
      try {
        const res = await authApi.login({ email, password }, { retryOnUnauthorized: false });
        if (!res.success || !res.data) {
          return { ok: false, message: mapApiError(res) };
        }
        const { tokens, user: loginUser } = res.data;
        persistTokens(tokens.accessToken, tokens.refreshToken);
        setAccessTokenMemory(tokens.accessToken);
        setAuthHintCookie();
        const me = await authApi.fetchCurrentUser(tokens.accessToken);
        if (me.success && me.data) {
          setUser(me.data);
        } else {
          setUser(loginUserToMeShape(loginUser));
        }
        return { ok: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Network error';
        return { ok: false, message: msg };
      } finally {
        setIsBusy(false);
      }
    },
    []
  );

  const registerAccount = useCallback(async (payload: RegisterRequest): Promise<AuthResult> => {
    setIsBusy(true);
    try {
      const res = await authApi.register(payload);
      if (!res.success || !res.data) {
        return { ok: false, message: mapApiError(res) };
      }
      const { tokens, user: regUser } = res.data;
      persistTokens(tokens.accessToken, tokens.refreshToken);
      setAccessTokenMemory(tokens.accessToken);
      setAuthHintCookie();
      const me = await authApi.fetchCurrentUser(tokens.accessToken);
      if (me.success && me.data) {
        setUser(me.data);
      } else {
        setUser(loginUserToMeShape(regUser));
      }
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      return { ok: false, message: msg };
    } finally {
      setIsBusy(false);
    }
  }, []);

  const logout = useCallback(async () => {
    clearSession();
    configureApiAuth({
      getAccessToken: () => readStoredAccessToken(),
    });
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitialized,
      isBusy,
      loginWithPassword,
      registerAccount,
      logout,
      refreshUser,
    }),
    [user, isInitialized, isBusy, loginWithPassword, registerAccount, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
