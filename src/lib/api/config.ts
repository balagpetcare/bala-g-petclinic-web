/**
 * Resolves the browser-facing API base URL (includes `/api/v1` prefix).
 * Set `NEXT_PUBLIC_API_URL` in `.env.local` for local development and in deployment env for production.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env['NEXT_PUBLIC_API_URL']?.trim();
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }

  if (process.env['NODE_ENV'] !== 'production') {
    return 'http://localhost:4000/api/v1';
  }

  throw new Error(
    'NEXT_PUBLIC_API_URL is required in production. Use the full origin including the API version path (e.g. https://api.example.com/api/v1).'
  );
}

function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
