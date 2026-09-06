const CRUD = ['read', 'create', 'update', 'delete'];

const SUBJECTS = {
  unit: { casl: 'Unit', group: 'situs', label: 'Unit' },
  page: { casl: 'Page', group: 'konten', label: 'Halaman' },
  post: { casl: 'Post', group: 'konten', label: 'Pengumuman' },
  'post-category': { casl: 'PostCategory', group: 'konten', label: 'Kategori' },
  media: { casl: 'Media', group: 'media', label: 'Media' },
  'media-folder': { casl: 'MediaFolder', group: 'media', label: 'Folder media' },
  menu: { casl: 'Menu', group: 'situs', label: 'Menu' },
  'organization-member': { casl: 'OrganizationMember', group: 'konten', label: 'Struktur organisasi' },
  agenda: { casl: 'Agenda', group: 'konten', label: 'Agenda' },
  landing: { casl: 'Landing', group: 'situs', label: 'Landing page' },
  'content-type': { casl: 'ContentType', group: 'konten', label: 'Jenis data situs' },
  'content-entry': { casl: 'ContentEntry', group: 'konten', label: 'Entri data situs' },
  user: { casl: 'User', group: 'iam', label: 'Pengguna' },
  permission: { casl: 'Permission', group: 'iam', label: 'Permission' },
  role: { casl: 'Role', group: 'iam', label: 'Peran' },
};

const SPECIAL = [{ key: 'role', action: 'sync-permissions', description: 'Menyimpan matriks permission peran' }];

const CMS_KEYS = [
  'page',
  'post',
  'post-category',
  'media',
  'media-folder',
  'menu',
  'organization-member',
  'agenda',
  'landing',
  'content-type',
  'content-entry',
];

function toPermission(key, action, extra = {}) {
  const meta = SUBJECTS[key];
  return {
    name: `${key}.${action}`,
    action,
    subject: meta.casl,
    group: meta.group,
    description: extra.description || `${action} ${meta.label}`,
    key,
  };
}

function buildCatalog() {
  const items = [];
  Object.keys(SUBJECTS).forEach((key) => {
    CRUD.forEach((action) => items.push(toPermission(key, action)));
  });
  SPECIAL.forEach((item) => items.push(toPermission(item.key, item.action, { description: item.description })));
  return items;
}

function isAdminUnitDefault(item) {
  if (item.group === 'iam') return false;
  if (item.key === 'unit') return item.action === 'read' || item.action === 'update';
  return CMS_KEYS.includes(item.key);
}

module.exports = {
  CRUD,
  SUBJECTS,
  SPECIAL,
  CMS_KEYS,
  buildCatalog,
  isAdminUnitDefault,
  toPermission,
};
