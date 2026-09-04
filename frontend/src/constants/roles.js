export const ROLE_LABELS = {
  superadmin: 'Superadmin',
  admin_unit: 'Admin unit',
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role || 'Pengguna';
}
