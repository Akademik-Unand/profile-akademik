const { User } = require('../models');
const AppError = require('../utils/AppError');
const { verifyPassword, signToken } = require('../utils/auth');
const { listByRole } = require('../helpers/loadPermissions');
const logger = require('../utils/logger');

async function serializeUser(user) {
  const json = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete json.passwordHash;
  json.unitIds = (json.units || []).map((unit) => unit.id);
  json.permissions = await listByRole(json.role);
  return json;
}

async function login({ email, password }) {
  const user = await User.unscoped().findOne({
    where: { email },
    include: [{ association: 'units', through: { attributes: [] } }],
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AppError('Email atau password salah', 401);
  }

  const token = signToken({ id: user.id, role: user.role });
  logger.info({ userId: user.id }, 'User logged in');
  return { token, user: await serializeUser(user) };
}

async function getMe(userId) {
  const user = await User.findByPk(userId, {
    include: [{ association: 'units', through: { attributes: [] } }],
  });
  if (!user) {
    throw new AppError('Pengguna tidak ditemukan', 404);
  }
  return serializeUser(user);
}

module.exports = { login, getMe, serializeUser };
