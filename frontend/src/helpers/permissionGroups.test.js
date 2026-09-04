import { groupPermissions } from './permissionGroups';

describe('groupPermissions', () => {
  it('groups by group field', () => {
    const result = groupPermissions([
      { id: 1, group: 'konten', name: 'page.read' },
      { id: 2, group: 'iam', name: 'user.read' },
      { id: 3, group: 'konten', name: 'page.create' },
    ]);
    expect(result.konten).toHaveLength(2);
    expect(result.iam).toHaveLength(1);
  });
});
