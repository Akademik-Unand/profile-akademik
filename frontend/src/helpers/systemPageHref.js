import { ROUTES } from '../constants/routes';
import { isSystemPageSlug } from '../constants/systemPages';

export function systemPageHref(unitSlug, slug) {
  if (slug === 'pengumuman') return ROUTES.unitPosts(unitSlug);
  if (slug === 'organisasi') return ROUTES.unitOrganization(unitSlug);
  if (slug === 'agenda') return ROUTES.unitAgendas(unitSlug);
  return ROUTES.unitPage(unitSlug, slug);
}

export function publicPageHref(unitSlug, slug) {
  return isSystemPageSlug(slug) ? systemPageHref(unitSlug, slug) : ROUTES.unitPage(unitSlug, slug);
}
