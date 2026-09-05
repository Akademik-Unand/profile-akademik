import { publicPageHref, systemPageHref } from './systemPageHref';

describe('systemPageHref', () => {
  it('maps archive slugs to public routes', () => {
    expect(systemPageHref('', 'pengumuman')).toBe('/pengumuman');
    expect(systemPageHref('perpustakaan', 'organisasi')).toBe('/perpustakaan/organisasi');
    expect(systemPageHref('', 'agenda')).toBe('/agenda');
  });

  it('keeps ordinary pages on /halaman', () => {
    expect(publicPageHref('', 'profil')).toBe('/halaman/profil');
    expect(publicPageHref('', 'pengumuman')).toBe('/pengumuman');
  });
});
