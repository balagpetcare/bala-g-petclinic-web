import type { ApiRequestConfig, BackendApiResponse } from '@/types/api';
import { backendFetch } from './fetcher';

export const http = {
  get: <T>(path: string, init?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    backendFetch<T>(path, { ...init, method: 'GET' }),

  post: <T>(
    path: string,
    body?: unknown,
    init?: Omit<ApiRequestConfig, 'method' | 'body'>
  ) => backendFetch<T>(path, { ...init, method: 'POST', body }),

  put: <T>(
    path: string,
    body?: unknown,
    init?: Omit<ApiRequestConfig, 'method' | 'body'>
  ) => backendFetch<T>(path, { ...init, method: 'PUT', body }),

  patch: <T>(
    path: string,
    body?: unknown,
    init?: Omit<ApiRequestConfig, 'method' | 'body'>
  ) => backendFetch<T>(path, { ...init, method: 'PATCH', body }),

  delete: <T>(path: string, init?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    backendFetch<T>(path, { ...init, method: 'DELETE' }),
};

export function assertBackendSuccess<T>(
  result: BackendApiResponse<T>
): asserts result is BackendApiResponse<T> & { success: true; data: T } {
  if (!result.success || result.data === undefined) {
    const code = result.error?.code ?? 'UNKNOWN';
    const message = result.error?.message ?? 'Request was not successful';
    throw new Error(`${code}: ${message}`);
  }
}
