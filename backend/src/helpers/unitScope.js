const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

function unitIdsOf(user) {
  return user?.unitIds || [];
}

function isSuperadmin(user) {
  return user?.role === 'superadmin';
}

function isBlankUnitId(value) {
  return value === undefined || value === null || value === '';
}

function applyUnitScope(extraWhere, currentUser, field = 'unitId') {
  if (!isSuperadmin(currentUser)) {
    extraWhere[field] = { [Op.in]: unitIdsOf(currentUser) };
  }
  return extraWhere;
}

function applyListUnitFilter(extraWhere, query, currentUser) {
  if (query.site === 'main') {
    if (isSuperadmin(currentUser)) extraWhere.unitId = null;
    return extraWhere;
  }
  if (query.unitId) extraWhere.unitId = Number(query.unitId);
  return extraWhere;
}

function assertUnitAccess(currentUser, unitId) {
  if (isBlankUnitId(unitId)) {
    if (!isSuperadmin(currentUser)) {
      throw new AppError('Hanya superadmin yang dapat mengelola konten situs utama', 403);
    }
    return;
  }
  if (isSuperadmin(currentUser)) return;
  const id = Number(unitId);
  if (!unitIdsOf(currentUser).includes(id)) {
    throw new AppError('Anda tidak memiliki izin untuk aksi ini', 403);
  }
}

function resolveCreateUnitId(currentUser, requestedUnitId) {
  if (isSuperadmin(currentUser)) {
    if (isBlankUnitId(requestedUnitId)) return null;
    return Number(requestedUnitId);
  }
  const ids = unitIdsOf(currentUser);
  if (!ids.length) {
    throw new AppError('Anda tidak memiliki unit yang ditugaskan', 403);
  }
  if (!isBlankUnitId(requestedUnitId) && !ids.includes(Number(requestedUnitId))) {
    throw new AppError('Anda tidak memiliki izin untuk aksi ini', 403);
  }
  return isBlankUnitId(requestedUnitId) ? ids[0] : Number(requestedUnitId);
}

function contentWhereForUnit(unit, field = 'unitId') {
  if (unit?.isDefault) {
    return { [Op.or]: [{ [field]: null }, { [field]: unit.id }] };
  }
  return { [field]: unit.id };
}

async function findPublishedBySlug(Model, unit, slug, options = {}) {
  const where = { slug, status: 'published', ...(options.where || {}) };
  const query = { include: options.include };
  if (unit.isDefault) {
    const rows = await Model.findAll({
      ...query,
      where: { ...where, [Op.or]: [{ unitId: null }, { unitId: unit.id }] },
      order: [['updatedAt', 'DESC']],
      limit: 1,
    });
    return rows[0] || null;
  }
  return Model.findOne({ ...query, where: { ...where, unitId: unit.id } });
}

module.exports = {
  unitIdsOf,
  isSuperadmin,
  isBlankUnitId,
  applyUnitScope,
  applyListUnitFilter,
  assertUnitAccess,
  resolveCreateUnitId,
  contentWhereForUnit,
  findPublishedBySlug,
};
