import { listedUnits, publicHref, rewriteMainSitePath, unitNavEntries, unitPathSlug } from './publicHref';

describe('publicHref', () => {
  it('omits the unit prefix for the main site', () => {
    expect(publicHref('', 'posts')).toBe('/pengumuman');
    expect(publicHref({ isDefault: true, slug: 'akademik' }, 'page', 'profil')).toBe('/halaman/profil');
    expect(unitPathSlug({ isDefault: true, slug: 'akademik' })).toBe('');
  });

  it('prefixes paths for a regular unit', () => {
    expect(publicHref('perpustakaan', 'post', 'jam-buka')).toBe('/perpustakaan/pengumuman/jam-buka');
    expect(publicHref({ slug: 'perpustakaan' }, 'agenda')).toBe('/perpustakaan/agenda');
  });
});

describe('rewriteMainSitePath', () => {
  it('strips the akademik prefix from main-site paths', () => {
    expect(rewriteMainSitePath('/akademik')).toBe('/');
    expect(rewriteMainSitePath('/akademik/organisasi')).toBe('/organisasi');
    expect(rewriteMainSitePath('/akademik/halaman/profil')).toBe('/halaman/profil');
  });

  it('leaves other units and absolute urls alone', () => {
    expect(rewriteMainSitePath('/perpustakaan/pengumuman')).toBe('/perpustakaan/pengumuman');
    expect(rewriteMainSitePath('https://sima.unand.ac.id')).toBe('https://sima.unand.ac.id');
  });
});

describe('listedUnits', () => {
  it('drops the default unit', () => {
    expect(
      listedUnits([
        { slug: 'akademik', isDefault: true },
        { slug: 'perpustakaan', isDefault: false },
      ]).map((unit) => unit.slug),
    ).toEqual(['perpustakaan']);
  });
});

describe('unitNavEntries', () => {
  const units = [
    { id: 1, slug: 'akademik', name: 'Akademik UNAND', isDefault: true },
    { id: 2, slug: 'perpustakaan', name: 'Perpustakaan', isDefault: false },
  ];

  it('lists non-default units', () => {
    expect(unitNavEntries(units, { isDefault: true })).toEqual([
      { key: '2', label: 'Perpustakaan', to: '/perpustakaan' },
    ]);
  });

  it('adds a main-site link on a unit page', () => {
    expect(unitNavEntries(units, { slug: 'perpustakaan', isDefault: false })[0]).toEqual({
      key: 'main',
      label: 'Akademik UNAND',
      to: '/',
    });
  });

  it('hides when there are no other units', () => {
    expect(unitNavEntries([{ slug: 'akademik', isDefault: true }])).toEqual([]);
  });
});
