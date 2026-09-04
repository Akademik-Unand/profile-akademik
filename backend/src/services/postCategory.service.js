const { PostCategory, Unit } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId, contentWhereForUnit } = require('../helpers/unitScope');
const logger = require('../utils/logger');

function uniqueOrThrow(error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new AppError('Slug kategori sudah dipakai di unit ini', 422);
  }
  throw error;
}

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'slug'],
    sortableFields: ['name', 'slug', 'createdAt', 'updatedAt'],
    extraWhere,
  });

  const { rows, count } = await PostCategory.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  return { items: rows, page, limit, total: count };
}

async function listPublic(unitSlug) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const items = await PostCategory.findAll({
    where: contentWhereForUnit(unit),
    order: [['name', 'ASC']],
  });
  return { items, unit };
}

async function getById(id, currentUser) {
  const category = await PostCategory.findByPk(id);
  if (!category) throw new AppError('Kategori tidak ditemukan', 404);
  assertUnitAccess(currentUser, category.unitId);
  return category;
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  try {
    const category = await PostCategory.create({ ...payload, unitId });
    logger.info({ categoryId: category.id, unitId }, 'Post category created');
    return category;
  } catch (error) {
    uniqueOrThrow(error);
  }
}

async function update(id, payload, currentUser) {
  const category = await getById(id, currentUser);
  try {
    await category.update(payload);
    logger.info({ categoryId: category.id }, 'Post category updated');
    return category;
  } catch (error) {
    uniqueOrThrow(error);
  }
}

async function remove(id, currentUser) {
  const category = await getById(id, currentUser);
  await category.destroy();
  logger.info({ categoryId: id }, 'Post category deleted');
}

module.exports = { listAdmin, listPublic, getById, create, update, remove };
