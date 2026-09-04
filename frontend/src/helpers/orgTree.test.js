import { buildOrgTree, flattenOrgTree } from './orgTree';

describe('buildOrgTree', () => {
  it('nests staff under a parent by parentId', () => {
    const tree = buildOrgTree([
      { id: 1, parentId: null, name: 'WR I', order: 0 },
      { id: 2, parentId: 1, name: 'Direktur', order: 0 },
      { id: 3, parentId: 1, name: 'Kasubdit', order: 1 },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe('WR I');
    expect(tree[0].children.map((item) => item.name)).toEqual(['Direktur', 'Kasubdit']);
  });

  it('flattens org tree with depth', () => {
    const flat = flattenOrgTree([
      { id: 1, name: 'WR I', children: [{ id: 2, name: 'Direktur', children: [] }] },
    ]);
    expect(flat.map((item) => ({ name: item.name, depth: item.depth }))).toEqual([
      { name: 'WR I', depth: 0 },
      { name: 'Direktur', depth: 1 },
    ]);
  });
});
