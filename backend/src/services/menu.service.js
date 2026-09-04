const { Menu, Page, PostCategory, Unit } = require('../models');
const AppError = require('../utils/AppError');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId, contentWhereForUnit } = require('../helpers/unitScope');
const buildMenuTree = require('../helpers/menuTree');
const logger = require('../utils/logger');

const INCLUDES = [
  { model: Page, as: 'targetPage', attributes: ['id', 'slug', 'title', 'status'] },
  { model: PostCategory, as: 'targetCategory', attributes: ['id', 'slug', 'name'] },
];

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);
  if (query.location) extraWhere.location = query.location;
  const items = await Menu.findAll({
    where: extraWhere,
    order: [['order', 'ASC'], ['id', 'ASC']],
    include: [...INCLUDES, { model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  return { items, tree: buildMenuTree(items) };
}

async function listPublicForUnit(unit, location) {
  const extraWhere = contentWhereForUnit(unit);
  if (location) extraWhere.location = location;
  const items = await Menu.findAll({
    where: extraWhere,
    order: [['order', 'ASC'], ['id', 'ASC']],
    include: INCLUDES,
  });
  return buildMenuTree(items);
}

async function listPublic(unitSlug, query = {}) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const items = await listPublicForUnit(unit, query.location);
  return { items, unit };
}

async function listByUnitId(unitId, location) {
  const where = { unitId };
  if (location) where.location = location;
  const items = await Menu.findAll({
    where,
    order: [['order', 'ASC'], ['id', 'ASC']],
    include: INCLUDES,
  });
  return buildMenuTree(items);
}

async function getById(id, currentUser) {
  const menu = await Menu.findByPk(id, { include: INCLUDES });
  if (!menu) throw new AppError('Menu tidak ditemukan', 404);
  assertUnitAccess(currentUser, menu.unitId);
  return menu;
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  const menu = await Menu.create({ ...payload, unitId, order: payload.order ?? 0 });
  logger.info({ menuId: menu.id, unitId }, 'Menu created');
  return menu;
}

async function update(id, payload, currentUser) {
  const menu = await getById(id, currentUser);
  if (Object.prototype.hasOwnProperty.call(payload, 'unitId')) {
    assertUnitAccess(currentUser, payload.unitId);
  }
  await menu.update(payload);
  logger.info({ menuId: menu.id }, 'Menu updated');
  return menu;
}

async function remove(id, currentUser) {
  const menu = await getById(id, currentUser);
  await menu.destroy();
  logger.info({ menuId: id }, 'Menu deleted');
}

async function reorder(items, currentUser) {
  if (!Array.isArray(items) || !items.length) {
    throw new AppError('Daftar menu tidak boleh kosong', 422);
  }
  const { sequelize } = require('../models');
  await sequelize.transaction(async (transaction) => {
    for (const item of items) {
      const menu = await Menu.findByPk(item.id, { transaction });
      if (!menu) throw new AppError('Menu tidak ditemukan', 404);
      assertUnitAccess(currentUser, menu.unitId);
      await menu.update({ parentId: item.parentId ?? null, order: item.order }, { transaction });
    }
  });
  logger.info({ count: items.length }, 'Menus reordered');
}

module.exports = { listAdmin, listPublic, listPublicForUnit, listByUnitId, getById, create, update, remove, reorder };
