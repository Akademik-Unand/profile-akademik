import { landingBuilderHref, resolveLandingUnitId, systemPageDataHref, systemPageDataLabel } from './pageListActions';

describe('pageListActions', () => {
  it('opens the home canvas without a separate landing menu', () => {
    expect(landingBuilderHref('')).toBe('/admin/landing/builder?site=main');
    expect(landingBuilderHref(4)).toBe('/admin/landing/builder?unitId=4');
  });

  it('scopes beranda to the assigned unit for admin_unit', () => {
    expect(resolveLandingUnitId({ role: 'admin_unit', units: [{ id: 7 }] }, '')).toBe(7);
    expect(resolveLandingUnitId({ role: 'superadmin' }, 3)).toBe(3);
    expect(resolveLandingUnitId({ role: 'superadmin' }, '')).toBe('');
  });

  it('points archive pages to their data screens', () => {
    expect(systemPageDataHref('pengumuman')).toBe('/admin/posts');
    expect(systemPageDataHref('organisasi')).toBe('/admin/organization');
    expect(systemPageDataLabel('agenda')).toBe('Kelola agenda');
  });
});
