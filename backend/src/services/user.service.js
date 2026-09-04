const { User, Unit, UserUnit, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { hashPassword } = require('../utils/auth');
const logger = require('../utils/logger');

const UNIT_INCLUDE = { association: 'units', through: { attributes: [] }, attributes: ['id', 'name', 'slug'] };

function toSafe(user) {
  const json = user.toJSON();
  delete json.passwordHash;
  json.unitIds = (json.units || []).map((unit) => unit.id);
  return json;
}

async function list(query) {
  const extraWhere = {};
  if (query.role) extraWhere.role = query.role;
  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'email'],
    sortableFields: ['name', 'email', 'role', 'createdAt', 'updatedAt'],
    extraWhere,
  });
  const { rows, count } = await User.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [UNIT_INCLUDE],
  });
  return { items: rows.map(toSafe), page, limit, total: count };
}

async function getById(id) {
  const user = await User.findByPk(id, { include: [UNIT_INCLUDE] });
  if (!user) throw new AppError('Pengguna tidak ditemukan', 404);
  return toSafe(user);
}

async function syncUnits(userId, unitIds, transaction) {
  const unique = [...new Set((unitIds || []).map(Number).filter(Boolean))];
  if (unique.length) {
    const found = await Unit.findAll({ where: { id: unique }, transaction });
    if (found.length !== unique.length) throw new AppError('Sebagian unit tidak ditemukan', 422);
  }
  await UserUnit.destroy({ where: { userId }, transaction });
  if (unique.length) {
    await UserUnit.bulkCreate(
      unique.map((unitId) => ({ userId, unitId })),
      { transaction },
    );
  }
}

async function create(payload) {
  const existing = await User.unscoped().findOne({ where: { email: payload.email } });
  if (existing) throw new AppError('Email sudah terdaftar', 422);
  const createdId = await sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        name: payload.name,
        email: payload.email,
        passwordHash: await hashPassword(payload.password),
        role: payload.role || 'admin_unit',
      },
      { transaction },
    );
    await syncUnits(user.id, payload.unitIds, transaction);
    logger.info({ userId: user.id }, 'User created');
    return user.id;
  });
  return getById(createdId);
}

async function update(id, payload, currentUser) {
  const user = await User.unscoped().findByPk(id);
  if (!user) throw new AppError('Pengguna tidak ditemukan', 404);
  if (payload.role && payload.role !== user.role && currentUser?.id === user.id) {
    throw new AppError('Tidak dapat mengubah peran akun sendiri', 422);
  }
  const next = { ...payload };
  delete next.unitIds;
  delete next.password;
  if (payload.password) next.passwordHash = await hashPassword(payload.password);
  await sequelize.transaction(async (transaction) => {
    await user.update(next, { transaction });
    if (payload.unitIds) await syncUnits(user.id, payload.unitIds, transaction);
    logger.info({ userId: user.id }, 'User updated');
  });
  return getById(user.id);
}

async function remove(id, currentUser) {
  if (Number(id) === currentUser.id) throw new AppError('Tidak dapat menghapus akun sendiri', 422);
  const user = await User.findByPk(id);
  if (!user) throw new AppError('Pengguna tidak ditemukan', 404);
  await user.destroy();
  logger.info({ userId: id }, 'User deleted');
}

module.exports = { list, getById, create, update, remove };
