import { isHrefActive, isMenuItemActive } from './menuActive';

describe('isHrefActive', () => {
  it('matches a page and its nested path', () => {
    expect(isHrefActive('/halaman/profil', '/halaman/profil')).toBe(true);
    expect(isHrefActive('/pengumuman', '/pengumuman/slug-berita')).toBe(true);
    expect(isHrefActive('/', '/agenda')).toBe(false);
  });

  it('matches category query on the same path', () => {
    expect(isHrefActive('/pengumuman?category=berita', '/pengumuman', '?category=berita')).toBe(true);
    expect(isHrefActive('/pengumuman?category=berita', '/pengumuman', '?category=agenda')).toBe(false);
  });
});

describe('isMenuItemActive', () => {
  it('marks a parent active when a child matches', () => {
    const item = {
      type: 'custom',
      children: [{ type: 'archive', archiveKind: 'agenda' }],
    };
    expect(isMenuItemActive(item, '', '/agenda')).toBe(true);
    expect(isMenuItemActive(item, '', '/pengumuman')).toBe(false);
  });
});
