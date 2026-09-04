jest.mock('../../../src/models', () => ({
  Permission: { findAndCountAll: jest.fn(), findAll: jest.fn() },
  RolePermission: { findAll: jest.fn(), destroy: jest.fn(), bulkCreate: jest.fn() },
  sequelize: { transaction: (fn) => fn({}) },
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const { Permission, RolePermission } = require('../../../src/models');
const permissionService = require('../../../src/services/permission.service');

describe('permission.service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns matrix roles and grant map', async () => {
    Permission.findAll.mockResolvedValue([{ id: 1, name: 'page.read' }]);
    RolePermission.findAll.mockResolvedValue([{ role: 'admin_unit', permissionId: 1 }]);
    const result = await permissionService.getMatrix();
    expect(result.roles[0].name).toBe('admin_unit');
    expect(result.grants.admin_unit).toEqual([1]);
  });

  it('rejects syncing superadmin', async () => {
    await expect(permissionService.syncRole('superadmin', [1])).rejects.toMatchObject({ statusCode: 422 });
  });
});
