/**
 * In-memory access token for SPA flows. Prefer HttpOnly cookies for refresh tokens (backend-supported).
 * Future: swap `getAccessToken` via `configureApiAuth` to read from secure storage or a session provider.
 */
let memoryAccessToken: string | null = null;

export function setAccessTokenMemory(token: string | null): void {
  memoryAccessToken = token;
}

export function getAccessTokenMemory(): string | null {
  return memoryAccessToken;
}

export type AccessTokenResolver = () => string | null | Promise<string | null>;

let customAccessTokenResolver: AccessTokenResolver | null = null;

export function configureApiAuth(config: { getAccessToken?: AccessTokenResolver | null }): void {
  customAccessTokenResolver = config.getAccessToken ?? null;
}

export async function resolveAccessToken(override?: string | null): Promise<string | null> {
  if (override !== undefined) {
    return override;
  }
  if (customAccessTokenResolver) {
    return Promise.resolve(customAccessTokenResolver());
  }
  return getAccessTokenMemory();
}

/** Optional hook for a future refresh-token pipeline (returns new access token or null). */
export type RefreshAccessTokenFn = () => Promise<string | null>;

let refreshAccessTokenFn: RefreshAccessTokenFn | null = null;

export function configureTokenRefresh(fn: RefreshAccessTokenFn | null): void {
  refreshAccessTokenFn = fn;
}

export function getTokenRefreshHandler(): RefreshAccessTokenFn | null {
  return refreshAccessTokenFn;
}
