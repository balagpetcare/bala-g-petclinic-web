import type { ApiError } from '@/types/api';

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, string[]>;
  public readonly apiError?: ApiError;

  constructor(
    message: string,
    status: number,
    code: string,
    details?: Record<string, string[]>,
    apiError?: ApiError
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.apiError = apiError;
  }
}

export function toApiRequestError(status: number, body: unknown): ApiRequestError {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error?: ApiError }).error;
    if (err?.message && err.code) {
      return new ApiRequestError(err.message, status, err.code, err.details, err);
    }
  }
  return new ApiRequestError(`Request failed with status ${status}`, status, 'HTTP_ERROR');
}
