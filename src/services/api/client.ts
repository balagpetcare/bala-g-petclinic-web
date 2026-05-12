import { backendFetch } from '@/lib/api';
import type { ApiRequestConfig, ApiResponse } from '@/types/api';

/**
 * Legacy-compatible client; delegates to {@link backendFetch} from `@/lib/api`.
 * Prefer importing `http` or `backendFetch` from `@/lib/api` in new code.
 */
export async function apiClient<T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers,
    body,
    params,
    cache,
    next,
    credentials,
    signal,
    accessToken,
    retryOnUnauthorized,
  } = config;

  return backendFetch<T>(endpoint, {
    method,
    headers,
    body,
    params,
    cache,
    next,
    credentials,
    signal,
    accessToken,
    retryOnUnauthorized,
  });
}

export const api = {
  get: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'PATCH', body }),

  delete: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};
