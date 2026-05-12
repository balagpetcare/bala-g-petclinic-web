/**
 * Public auth shapes aligned with `backend-api` auth responses (no Prisma enums on the wire).
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt?: string | null;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthLoginResponseDto {
  user: AuthUserDto;
  tokens: AuthTokensDto;
}

export interface AuthMeResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
  passwordChangedAt?: string | null;
  createdAt?: string;
}
