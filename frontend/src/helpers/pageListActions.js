import { ROUTES } from '../constants/routes';

export function resolveLandingUnitId(user, selected) {
  if (user?.role === 'superadmin') return selected || '';
  return user?.units?.[0]?.id || '';
}

export function landingBuilderHref(unitId) {
  return unitId ? `${ROUTES.adminLandingBuilder}?unitId=${unitId}` : `${ROUTES.adminLandingBuilder}?site=main`;
}

export function landingPreviewHref(unitId) {
  return unitId ? `${ROUTES.adminLandingPreview}?unitId=${unitId}` : `${ROUTES.adminLandingPreview}?site=main`;
}

export function systemPageDataHref(slug) {
  if (slug === 'pengumuman') return ROUTES.adminPosts;
  if (slug === 'organisasi') return ROUTES.adminOrganization;
  if (slug === 'agenda') return ROUTES.adminAgendas;
  return null;
}

export function systemPageDataLabel(slug) {
  if (slug === 'pengumuman') return 'Kelola artikel';
  if (slug === 'organisasi') return 'Kelola anggota';
  if (slug === 'agenda') return 'Kelola agenda';
  return null;
}
