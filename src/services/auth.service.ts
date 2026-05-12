import { http } from '@/lib/api';
import type { BackendApiResponse } from '@/types/api';
import type {
  AuthLoginResponseDto,
  AuthMeResponseDto,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth-contract';

export async function login(
  payload: LoginRequest,
  init?: { retryOnUnauthorized?: boolean }
): Promise<BackendApiResponse<AuthLoginResponseDto>> {
  return http.post<AuthLoginResponseDto>('/auth/login', payload, {
    retryOnUnauthorized: init?.retryOnUnauthorized ?? false,
  });
}

export async function forgotPassword(
  payload: ForgotPasswordRequest
): Promise<BackendApiResponse<{ message?: string }>> {
  return http.post<{ message?: string }>('/auth/forgot-password', payload, {
    retryOnUnauthorized: false,
  });
}

export async function resetPassword(
  payload: ResetPasswordRequest
): Promise<BackendApiResponse<{ message?: string }>> {
  return http.post<{ message?: string }>('/auth/reset-password', payload, {
    retryOnUnauthorized: false,
  });
}

export async function register(
  payload: RegisterRequest
): Promise<BackendApiResponse<AuthLoginResponseDto>> {
  return http.post<AuthLoginResponseDto>('/auth/register', payload, {
    retryOnUnauthorized: false,
  });
}

export async function fetchCurrentUser(
  accessToken: string
): Promise<BackendApiResponse<AuthMeResponseDto>> {
  return http.get<AuthMeResponseDto>('/auth/me', {
    accessToken,
    retryOnUnauthorized: false,
  });
}
