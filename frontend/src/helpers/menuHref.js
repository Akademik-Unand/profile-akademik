import { publicHref, rewriteMainSitePath } from './publicHref';

export function menuHref(item, unitSlug) {
  if (!item) return '#';
  if (item.type === 'external_url') return rewriteMainSitePath(item.externalUrl || '#') || '#';
  if (item.type === 'page' && item.targetPage?.slug) {
    return publicHref(unitSlug, 'page', item.targetPage.slug);
  }
  if (item.type === 'post_category') {
    const category = item.targetCategory?.slug;
    const base = publicHref(unitSlug, 'posts');
    return category ? `${base}?category=${category}` : base;
  }
  if (item.type === 'dynamic_content' && item.targetContentType?.key) {
    return publicHref(unitSlug, 'data', item.targetContentType.key);
  }
  if (item.type === 'archive') {
    const kind = item.archiveKind || item.externalUrl;
    if (kind === 'posts') return publicHref(unitSlug, 'posts');
    if (kind === 'organization') return publicHref(unitSlug, 'org');
    if (kind === 'agenda') return publicHref(unitSlug, 'agenda');
  }
  return '#';
}
