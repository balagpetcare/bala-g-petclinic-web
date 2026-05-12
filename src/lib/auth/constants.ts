/** localStorage keys — keep stable for migrations */
export const AUTH_STORAGE_ACCESS = 'bg_access_token';
export const AUTH_STORAGE_REFRESH = 'bg_refresh_token';

/**
 * Non-secret hint cookie so middleware can send users to /login before client hydration.
 * Cleared on logout; set when a session is established. APIs still require a valid Bearer token.
 */
export const AUTH_HINT_COOKIE = 'bg_auth_hint';

/** Roles allowed to see the `/admin` clinic placeholder (clinic operations). */
export const ADMIN_PORTAL_ROLES = new Set(['SUPER_ADMIN', 'CLINIC_ADMIN', 'BRANCH_ADMIN']);

/** Roles that may use analytics dashboards in the public app (API still enforces RBAC). */
export const ANALYTICS_UI_ROLES = new Set(['SUPER_ADMIN', 'CLINIC_ADMIN', 'BRANCH_ADMIN', 'STAFF', 'RECEPTIONIST', 'DOCTOR']);

export function isAdminPortalRole(role: string | undefined | null): boolean {
  if (!role) return false;
  return ADMIN_PORTAL_ROLES.has(role);
}

export function canAccessAnalyticsUi(role: string | undefined | null): boolean {
  if (!role) return false;
  return ANALYTICS_UI_ROLES.has(role);
}
