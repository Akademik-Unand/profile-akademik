import { ROUTES } from './routes';

export const NAVIGATION_MENU = [
  {
    type: 'link',
    label: 'Dashboard',
    path: ROUTES.adminDashboard,
    icon: 'mdi:view-dashboard-outline',
  },
  {
    type: 'group',
    title: 'Situs',
    items: [
      {
        label: 'Landing page',
        path: ROUTES.adminLanding,
        icon: 'mdi:image-text',
        permission: { action: 'read', subject: 'Landing' },
      },
      {
        label: 'Menu',
        path: ROUTES.adminMenus,
        icon: 'mdi:menu',
        permission: { action: 'create', subject: 'Menu' },
      },
      {
        label: 'SEO',
        path: ROUTES.adminSeo,
        icon: 'mdi:search-web',
        permission: { action: 'update', subject: 'Unit' },
      },
    ],
  },
  {
    type: 'group',
    title: 'Konten',
    items: [
      {
        label: 'Unit',
        path: ROUTES.adminUnits,
        icon: 'mdi:office-building-outline',
        permission: { action: 'manage', subject: 'Unit' },
      },
      {
        label: 'Halaman',
        path: ROUTES.adminPages,
        icon: 'mdi:file-document-outline',
        permission: { action: 'create', subject: 'Page' },
      },
      {
        label: 'Pengumuman',
        path: ROUTES.adminPosts,
        icon: 'mdi:bullhorn-outline',
        permission: { action: 'create', subject: 'Post' },
      },
      {
        label: 'Kategori',
        path: ROUTES.adminCategories,
        icon: 'mdi:tag-outline',
        permission: { action: 'create', subject: 'PostCategory' },
      },
      {
        label: 'Struktur organisasi',
        path: ROUTES.adminOrganization,
        icon: 'mdi:account-group-outline',
        permission: { action: 'create', subject: 'OrganizationMember' },
      },
      {
        label: 'Agenda',
        path: ROUTES.adminAgendas,
        icon: 'mdi:calendar-month-outline',
        permission: { action: 'create', subject: 'Agenda' },
      },
    ],
  },
  {
    type: 'group',
    title: 'Media',
    items: [
      {
        label: 'Galeri',
        path: ROUTES.adminMedia,
        icon: 'mdi:image-multiple-outline',
        permission: { action: 'create', subject: 'Media' },
      },
    ],
  },
  {
    type: 'group',
    title: 'Pengaturan',
    items: [
      {
        label: 'Pengguna',
        path: ROUTES.adminUsers,
        icon: 'mdi:account-outline',
        permission: { action: 'read', subject: 'User' },
      },
      {
        label: 'Permission',
        path: ROUTES.adminPermissions,
        icon: 'mdi:shield-account-outline',
        permission: { action: 'read', subject: 'Permission' },
      },
    ],
  },
];
