/**
 * Slug untuk fetch API vs path URL publik.
 * Jangan menebak slug unit (mis. "akademik") — itu membuat data unit lain
 * sempat tampil lalu hilang saat unit aslinya ketemu.
 */
export function resolveBuilderSlugs(unit, unitSlug = '') {
  const apiSlug = unit?.slug || unitSlug || '';
  const pathSlug = unit?.isDefault ? '' : unitSlug || (unit?.isDefault === false ? unit.slug : '') || '';
  return {
    apiSlug,
    pathSlug,
    ready: Boolean(apiSlug),
  };
}
