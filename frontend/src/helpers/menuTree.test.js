import { buildMenuTree, flattenMenuTree, menusByLocation, splitFooterMenus } from './menuTree';

describe('buildMenuTree', () => {
  it('nests children by parentId and sorts by order', () => {
    const tree = buildMenuTree([
      { id: 2, parentId: 1, label: 'Visi', order: 1 },
      { id: 1, parentId: null, label: 'Profil', order: 0 },
      { id: 3, parentId: 1, label: 'Sejarah', order: 0 },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe('Profil');
    expect(tree[0].children.map((item) => item.label)).toEqual(['Sejarah', 'Visi']);
  });

  it('flattens a tree with depth', () => {
    const flat = flattenMenuTree([{ id: 1, label: 'Profil', children: [{ id: 2, label: 'Visi', children: [] }] }]);
    expect(flat.map((item) => item.depth)).toEqual([0, 1]);
  });

  it('filters menus by location before nesting', () => {
    const tree = menusByLocation(
      [
        { id: 1, parentId: null, label: 'Beranda', location: 'header', order: 0 },
        { id: 2, parentId: null, label: 'SIMA', location: 'footer', order: 0 },
      ],
      'footer',
    );
    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe('SIMA');
  });

  it('splits footer menus into internal links and external resources', () => {
    const { links, resources } = splitFooterMenus([
      { id: 1, label: 'Kalender', type: 'page', externalUrl: null },
      { id: 2, label: 'SIMA', type: 'external_url', externalUrl: 'https://sima.unand.ac.id' },
    ]);
    expect(links.map((item) => item.label)).toEqual(['Kalender']);
    expect(resources.map((item) => item.label)).toEqual(['SIMA']);
  });
});
