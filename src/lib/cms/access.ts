/** Roles allowed to use in-app CMS tools (JWT role string). Aligns with backend CMS permissions. */
const CMS_UI_ROLES = new Set([
  'SUPER_ADMIN',
  'ADMIN',
  'CLINIC_ADMIN',
  'BRANCH_ADMIN',
  'STAFF',
  'RECEPTIONIST',
]);

export function canUseCmsUi(role: string | undefined): boolean {
  if (!role) return false;
  return CMS_UI_ROLES.has(role);
}
