export const SYSTEM_PAGE_SLUGS = ['pengumuman', 'organisasi', 'agenda'];

export const SYSTEM_PAGE_ARCHIVE = {
  pengumuman: 'PostArchive',
  organisasi: 'OrganizationTree',
  agenda: 'AgendaArchive',
};

export function isSystemPageSlug(slug) {
  return SYSTEM_PAGE_SLUGS.includes(slug);
}
