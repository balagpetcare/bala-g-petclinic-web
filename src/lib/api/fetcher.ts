import type { ApiRequestConfig, BackendApiResponse } from '@/types/api';
import { getApiBaseUrl } from './config';
import { ApiRequestError, toApiRequestError } from './errors';
import { resolveAccessToken, getTokenRefreshHandler } from './token';

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function applySearchParams(
  url: URL,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (!params) return;
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
}

function defaultCredentials(): RequestCredentials {
  if (typeof window === 'undefined') {
    return 'omit';
  }
  return 'include';
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function isEnvelope(value: unknown): value is BackendApiResponse<unknown> {
  return Boolean(value && typeof value === 'object' && 'success' in value);
}

/**
 * Typed fetch aligned with backend `{ success, data, error, meta }` envelopes.
 * Returns the parsed envelope; throws {@link ApiRequestError} on transport failures or unparseable critical errors.
 */
export async function backendFetch<T>(
  path: string,
  init: ApiRequestConfig = {}
): Promise<BackendApiResponse<T>> {
  const base = getApiBaseUrl();
  const url = new URL(joinUrl(base, path));
  applySearchParams(url, init.params);

  const token = await resolveAccessToken(init.accessToken);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...init.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const exec = async (): Promise<BackendApiResponse<T>> => {
    const requestInit: RequestInit = {
      method: init.method ?? 'GET',
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: init.credentials ?? defaultCredentials(),
      signal: init.signal,
    };
    if (init.next !== undefined) {
      requestInit.next = init.next;
    }
    if (init.cache !== undefined) {
      requestInit.cache = init.cache;
    } else if (init.next !== undefined) {
      // Next.js: `cache: 'no-store'` must not be combined with `next.revalidate` / tags (build warns and can fail prerender).
      requestInit.cache = 'force-cache';
    } else {
      requestInit.cache = 'no-store';
    }

    const response = await fetch(url.toString(), requestInit);

    const parsed = await readBody(response);

    if (!response.ok) {
      if (isEnvelope(parsed) && parsed.success === false) {
        return parsed as BackendApiResponse<T>;
      }
      throw toApiRequestError(response.status, parsed);
    }

    if (isEnvelope(parsed)) {
      return parsed as BackendApiResponse<T>;
    }

    return {
      success: true,
      data: parsed as T,
    };
  };

  try {
    const first = await exec();
    if (first.success === false && first.error?.code === 'UNAUTHORIZED') {
      const shouldRetry = init.retryOnUnauthorized !== false;
      const refresher = getTokenRefreshHandler();
      if (shouldRetry && refresher) {
        const nextToken = await refresher();
        if (nextToken) {
          headers['Authorization'] = `Bearer ${nextToken}`;
          return exec();
        }
      }
    }
    return first;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Network error';
    throw new ApiRequestError(message, 0, 'NETWORK_ERROR');
  }
}
