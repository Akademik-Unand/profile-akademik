const buildMenuTree = require('../../../src/helpers/menuTree');

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
});
