# Frontend ↔ backend integration (Bala G Pet Clinic)

This document describes how the Next.js public site (`bala-g-public-web`) talks to the Express API (`backend-api`) in a way that stays modular, typed, and ready for JWT/session evolution and a future mobile client.

## Architecture

| Layer | Path | Role |
|--------|------|------|
| Config | `src/lib/api/config.ts` | Resolves `NEXT_PUBLIC_API_URL` (no hardcoded URLs in UI components). |
| Transport | `src/lib/api/fetcher.ts` (`backendFetch`) | JSON fetch, query params, Bearer token injection, credentials policy, optional 401 → refresh retry. |
| HTTP helpers | `src/lib/api/http.ts` (`http`, `assertBackendSuccess`) | Thin `GET` / `POST` / `PUT` / `PATCH` / `DELETE` wrappers. |
| Auth hooks (token-ready) | `src/lib/api/token.ts` | In-memory access token, `configureApiAuth`, `configureTokenRefresh` stub for a future refresh pipeline. |
| Domain services | `src/services/*.service.ts` | One module per domain (`health`, `auth`, …). Components and hooks call services, not raw URLs. |
| React hooks | `src/hooks/*.ts` | Optional composition for client-side data (e.g. `useApiHealth`). |
| Types | `src/types/api.ts`, `src/types/auth-contract.ts`, … | Shapes aligned with backend envelopes and DTOs. |

Legacy `src/services/api/client.ts` delegates to `backendFetch` so existing `api` / `apiClient` imports stay compatible without duplicating HTTP logic.

## Environment setup

### Backend (`backend-api`)

- `PORT` (default `4000`)
- `API_PREFIX` (default `/api/v1`)
- `CORS_ORIGINS` — comma-separated list of allowed **exact** origins (e.g. `http://localhost:3000`). Used with `credentials: true`.

### Frontend (`bala-g-public-web`)

Create `.env.local` (gitignored) from `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

`NEXT_PUBLIC_API_URL` must be the **full base** including the API version path so that service paths like `/health` resolve to `http://localhost:4000/api/v1/health`.

## API usage examples

### Health (server or client)

```ts
import { getHealth } from '@/services/health.service';

const res = await getHealth();
if (res.success) {
  console.log(res.data?.status);
}
```

### Typed envelope

All JSON responses follow the backend envelope:

```ts
import type { BackendApiResponse } from '@/types/api';
```

### Auth (login + protected call)

```ts
import { login, fetchCurrentUser } from '@/services/auth.service';

const auth = await login({ email: 'user@example.com', password: '********' });
if (auth.success && auth.data?.tokens.accessToken) {
  const me = await fetchCurrentUser(auth.data.tokens.accessToken);
}
```

For SPA flows you can also store the access token in memory:

```ts
import { setAccessTokenMemory, configureTokenRefresh } from '@/lib/api';

setAccessTokenMemory(accessToken);
configureTokenRefresh(async () => {
  // Future: exchange refresh token / cookie for new access token, then return it (or null).
  return null;
});
```

### Low-level client (escape hatch)

Prefer services. When needed:

```ts
import { http } from '@/lib/api';

await http.post('/some/path', { foo: 'bar' });
```

## Authentication flow preparation

1. **Access token**: Short-lived JWT from `POST /auth/login` or `POST /auth/register` (see backend `AUTH_USE_REFRESH_COOKIE` for refresh-in-cookie mode).
2. **Bearer header**: `backendFetch` adds `Authorization: Bearer <token>` when `accessToken` is passed per request, or from `configureApiAuth` / `setAccessTokenMemory`.
3. **Refresh (future)**: Implement `configureTokenRefresh` to return a new access token; the client retries once on `UNAUTHORIZED` when `retryOnUnauthorized` is not disabled.
4. **HttpOnly refresh cookies**: When the API uses cookie-based refresh, keep using `credentials: 'include'` in the browser (already the default for client-side requests in `backendFetch`).

## CORS and credentials

- Browser client calls use `credentials: 'include'` so cookie-based auth can work later.
- Server Components use `credentials: 'omit'` by default (no browser cookie jar).
- Backend `cors` uses a strict origin callback + `credentials: true` and the headers required by the auth stack (`Authorization`, `X-CSRF-Token`, device headers, etc.).

## Production deployment notes

1. Set `NEXT_PUBLIC_API_URL` to the public API origin + `/api/v1` (or your deployed prefix).
2. Set `CORS_ORIGINS` on the API to your real site origins (e.g. `https://balagpetclinic.com`), comma-separated. Do not rely on localhost entries in production.
3. Use HTTPS everywhere; cookie `secure` flags follow `NODE_ENV` on the API.
4. Keep secrets out of `NEXT_PUBLIC_*` variables; only public URLs belong there.

## Validation checklist

- `npm run dev` in `backend-api` and `bala-g-public-web`.
- Open `http://localhost:3000/system/connectivity` — server health JSON, browser health JSON, optional auth demo. This route uses `export const dynamic = 'force-dynamic'` because it calls the API with `cache: 'no-store'` during render (avoids static prerender issues and matches live diagnostics).
- Confirm `GET /api/v1/health` returns `success: true` from both server and browser sections.
- Run `npm run type-check` in the frontend repo.

## Related files

- Backend app entry: `backend-api/src/app.ts`, routes: `backend-api/src/routes/index.ts`
- Frontend demo page: `bala-g-public-web/src/app/(public)/system/connectivity/page.tsx`
