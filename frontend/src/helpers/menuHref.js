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
  return '#';
}
