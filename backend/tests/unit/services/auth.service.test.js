jest.mock('../../../src/models', () => ({
  User: {
    unscoped: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../../src/utils/auth', () => ({
  verifyPassword: jest.fn(),
  signToken: jest.fn(),
}));

jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../src/helpers/loadPermissions', () => ({
  listByRole: jest.fn().mockResolvedValue([]),
}));

const { User } = require('../../../src/models');
const { verifyPassword, signToken } = require('../../../src/utils/auth');
const authService = require('../../../src/services/auth.service');
const AppError = require('../../../src/utils/AppError');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('throws 401 when credentials are invalid', async () => {
      User.unscoped.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });
      await expect(authService.login({ email: 'a@b.c', password: 'secret1' })).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('returns token and user when credentials match', async () => {
      const user = {
        id: 1,
        role: 'superadmin',
        passwordHash: 'hashed',
        toJSON: () => ({ id: 1, role: 'superadmin', passwordHash: 'hashed', units: [] }),
      };
      User.unscoped.mockReturnValue({ findOne: jest.fn().mockResolvedValue(user) });
      verifyPassword.mockResolvedValue(true);
      signToken.mockReturnValue('jwt-token');

      const result = await authService.login({ email: 'admin@unand.ac.id', password: 'Admin123!' });
      expect(result.token).toBe('jwt-token');
      expect(result.user.passwordHash).toBeUndefined();
      expect(result.user.unitIds).toEqual([]);
    });
  });

  describe('getMe', () => {
    it('throws when user is missing', async () => {
      User.findByPk.mockResolvedValue(null);
      await expect(authService.getMe(99)).rejects.toBeInstanceOf(AppError);
    });
  });
});
