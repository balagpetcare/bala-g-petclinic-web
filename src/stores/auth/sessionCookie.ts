import { AUTH_HINT_COOKIE } from '@/lib/auth/constants';

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function setAuthHintCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_HINT_COOKIE}=1; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearAuthHintCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_HINT_COOKIE}=; Path=/; Max-Age=0`;
}
