# Auth UI integration — Bala G Pet Clinic (public web)

This document describes how authentication is wired on `D:\Pet Clinic\bala-g-public-web` using the **existing** API layer (`backendFetch` / `http`) and **`auth.service`**, without a parallel auth client.

## Goals

- Production-grade **login**, **register**, **forgot password**, **account**, and **admin** routes.
- **Single source of truth** for API calls: `@/services/auth.service` → `@/lib/api/http` → `backendFetch`.
- **Session persistence** in `localStorage` (access + refresh tokens) with a **non-secret** `bg_auth_hint` cookie for middleware redirects.
- **Hydration-safe** behaviour: no `localStorage` reads during SSR render; `AuthProvider` hydrates on the client then validates with `GET /auth/me`.

## Routes

| Path | Purpose |
|------|---------|
| `/login` | Email/password sign-in; supports `?callbackUrl=` (must be same-origin path). |
| `/register` | Patient portal registration (matches backend password rules). |
| `/forgot-password` | Triggers `POST /auth/forgot-password`. |
| `/reset-password?token=` | Optional UI for `POST /auth/reset-password` (email links should point here). |
| `/account` | Protected profile + logout + “refresh from server”. |
| `/admin` | Protected; placeholder only for clinic admin roles (`SUPER_ADMIN`, `CLINIC_ADMIN`, `BRANCH_ADMIN`). Staff without those roles see an access notice. |

Route groups:

- `(auth)/` — minimal branded shell (`AuthShell`), no marketing header/footer.
- `(public)/account` and `(public)/admin` — use the main site chrome; wrapped with `RequireAuth`.

## Key modules

| Area | Path |
|------|------|
| API calls | `src/services/auth.service.ts` (`login`, `register`, `forgotPassword`, `resetPassword`, `fetchCurrentUser`) |
| Token resolver | `src/lib/api/token.ts` — `configureApiAuth({ getAccessToken })` points at `localStorage` |
| Persistence | `src/stores/auth/storage.ts` — `bg_access_token`, `bg_refresh_token` |
| Middleware hint | `src/stores/auth/sessionCookie.ts` + `AUTH_HINT_COOKIE` in `src/lib/auth/constants.ts` |
| Context | `src/providers/AuthProvider.tsx` |
| Hook | `src/hooks/use-auth.ts` → re-exports `useAuth` |
| Gate | `src/components/auth/RequireAuth.tsx` |
| Edge gate | `src/middleware.ts` — redirects to `/login` when hint cookie is absent |

## Middleware vs client gate

- **Middleware** only sees cookies, not `localStorage`. The `bg_auth_hint` cookie is set when a session is established and cleared on logout. It is **not** proof of a valid JWT; APIs still enforce Bearer auth.
- **`RequireAuth`** runs after hydration and redirects if `/auth/me` fails or no token exists (covers expired tokens and deep links).

## Refresh tokens (future)

- `configureTokenRefresh` in `src/lib/api/token.ts` is already present; `AuthProvider` persists `refreshToken` when the backend returns it.
- Next step: implement a refresh endpoint caller and register it once via `configureTokenRefresh` — **do not** add a second fetch stack.

## Environment

- `NEXT_PUBLIC_API_URL` must include the API version prefix (e.g. `http://localhost:4000/api/v1`).
- Ecommerce mock flag (`NEXT_PUBLIC_USE_MOCK_ECOMMERCE`) is unrelated to auth.

## QA checklist

1. `npm run type-check` and `npm run build`.
2. Login → redirect to `callbackUrl` or `/account`.
3. Logout → tokens cleared, hint cookie cleared, `/account` sends you to `/login`.
4. Register with a password matching backend rules (uppercase + number, length ≥ 8).
5. Forgot password always shows a neutral success message (backend privacy behaviour).

## Safety / UX rules (project)

- No `href=""`, no clickable `div` for submit actions, no auth logic duplicated outside `auth.service` + `AuthProvider`.
