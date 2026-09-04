import { menuHref } from './menuHref';

describe('menuHref', () => {
  it('builds a page path', () => {
    expect(menuHref({ type: 'page', targetPage: { slug: 'profil' } }, 'akademik')).toBe(
      '/akademik/halaman/profil',
    );
  });

  it('builds a main-site page path without a unit prefix', () => {
    expect(menuHref({ type: 'page', targetPage: { slug: 'profil' } }, '')).toBe('/halaman/profil');
  });

  it('rewrites hardcoded akademik urls to the main site', () => {
    expect(menuHref({ type: 'external_url', externalUrl: '/akademik/organisasi' }, '')).toBe('/organisasi');
  });

  it('leaves other unit urls unchanged', () => {
    expect(menuHref({ type: 'external_url', externalUrl: '/perpustakaan/pengumuman' }, '')).toBe(
      '/perpustakaan/pengumuman',
    );
  });

  it('builds a category listing path', () => {
    expect(menuHref({ type: 'post_category', targetCategory: { slug: 'pengumuman' } }, 'akademik')).toBe(
      '/akademik/pengumuman?category=pengumuman',
    );
  });
});
