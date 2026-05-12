import { AUTH_STORAGE_ACCESS, AUTH_STORAGE_REFRESH } from '@/lib/auth/constants';

export function readStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_STORAGE_ACCESS);
  } catch {
    return null;
  }
}

export function readStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_STORAGE_REFRESH);
  } catch {
    return null;
  }
}

export function persistTokens(access: string, refresh?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_ACCESS, access);
    if (refresh) {
      window.localStorage.setItem(AUTH_STORAGE_REFRESH, refresh);
    }
  } catch {
    /* quota / private mode */
  }
}

export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_ACCESS);
    window.localStorage.removeItem(AUTH_STORAGE_REFRESH);
  } catch {
    /* ignore */
  }
}
