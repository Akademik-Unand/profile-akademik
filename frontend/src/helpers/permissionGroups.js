export const PERMISSION_GROUP_LABELS = {
  konten: 'Konten',
  media: 'Media',
  situs: 'Situs',
  iam: 'Pengguna & akses',
};

export function groupPermissions(permissions = []) {
  return permissions.reduce((groups, item) => {
    const key = item.group || 'lainnya';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}
