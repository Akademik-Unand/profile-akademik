jest.mock('../../../src/models', () => ({
  User: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    unscoped: jest.fn(),
    create: jest.fn(),
  },
  Unit: { findAll: jest.fn() },
  UserUnit: { destroy: jest.fn(), bulkCreate: jest.fn() },
  sequelize: { transaction: (fn) => fn({}) },
}));

jest.mock('../../../src/utils/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed'),
}));

jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const { User, Unit, UserUnit } = require('../../../src/models');
const userService = require('../../../src/services/user.service');

describe('user.service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists users without password hashes', async () => {
    User.findAndCountAll.mockResolvedValue({
      rows: [
        {
          toJSON: () => ({ id: 1, name: 'A', email: 'a@b.c', role: 'admin_unit', passwordHash: 'x', units: [{ id: 3 }] }),
        },
      ],
      count: 1,
    });
    const result = await userService.list({ page: 1, limit: 10 });
    expect(result.items[0].passwordHash).toBeUndefined();
    expect(result.items[0].unitIds).toEqual([3]);
  });

  it('rejects deleting the current user', async () => {
    await expect(userService.remove(2, { id: 2 })).rejects.toMatchObject({ statusCode: 422 });
  });

  it('creates a user and assigns units', async () => {
    User.unscoped.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });
    User.create.mockResolvedValue({ id: 9 });
    Unit.findAll.mockResolvedValue([{ id: 1 }]);
    User.findByPk.mockResolvedValue({
      toJSON: () => ({ id: 9, name: 'B', email: 'b@b.c', role: 'admin_unit', units: [{ id: 1 }] }),
    });
    const user = await userService.create({ name: 'B', email: 'b@b.c', password: 'password1', unitIds: [1] });
    expect(UserUnit.bulkCreate).toHaveBeenCalled();
    expect(user.unitIds).toEqual([1]);
  });
});
