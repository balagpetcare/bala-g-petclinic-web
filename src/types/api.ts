/**
 * Mirrors `backend-api` `src/core/types/response.ts` for end-to-end typing.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  requestId?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BackendApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

/** Alias for legacy imports — same shape as {@link BackendApiResponse}. */
export type ApiResponse<T = unknown> = BackendApiResponse<T>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  accessToken?: string | null;
  retryOnUnauthorized?: boolean;
}

/** Same as {@link ApiRequestConfig}; preferred name for the HTTP client layer. */
export type BackendRequestInit = ApiRequestConfig;
