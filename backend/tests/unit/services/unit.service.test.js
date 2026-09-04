jest.mock('../../../src/models', () => ({
  Unit: {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  Media: {},
  sequelize: {
    transaction: (fn) => fn({}),
  },
}));

jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const { Unit } = require('../../../src/models');
const unitService = require('../../../src/services/unit.service');
const AppError = require('../../../src/utils/AppError');

describe('unit.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBySlug throws 404 when missing', async () => {
    Unit.findOne.mockResolvedValue(null);
    await expect(unitService.getBySlug('tidak-ada')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('refuses to delete the default unit', async () => {
    Unit.findByPk.mockResolvedValue({ id: 1, isDefault: true, destroy: jest.fn() });
    await expect(unitService.remove(1)).rejects.toBeInstanceOf(AppError);
    await expect(unitService.remove(1)).rejects.toMatchObject({ statusCode: 422 });
  });

  it('includes logo and cover on the public unit list', async () => {
    Unit.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    await unitService.listPublic({ page: 1, limit: 10 });
    const arg = Unit.findAndCountAll.mock.calls[0][0];
    expect(arg.include.map((item) => item.as)).toEqual(['logo', 'cover']);
    expect(arg.attributes).toContain('coverMediaId');
  });

  it('scopes admin_unit list to assigned ids', async () => {
    Unit.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
    await unitService.listAdmin({ page: 1, limit: 10 }, { role: 'admin_unit', unitIds: [3] });
    const arg = Unit.findAndCountAll.mock.calls[0][0];
    expect(arg.where.id).toBeDefined();
  });
});
