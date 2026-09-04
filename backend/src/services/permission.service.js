const { Permission, RolePermission, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { buildCatalog } = require('../constants/permissions');
const logger = require('../utils/logger');

const MATRIX_ROLES = [{ name: 'admin_unit', label: 'Admin unit' }];

async function list(query) {
  const extraWhere = {};
  if (query.group) extraWhere.group = query.group;
  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'description', 'subject'],
    sortableFields: ['name', 'group', 'subject', 'action', 'createdAt'],
    extraWhere,
  });
  const { rows, count } = await Permission.findAndCountAll({ where, order, limit, offset });
  return { items: rows, page, limit, total: count };
}

async function getMatrix() {
  const permissions = await Permission.findAll({
    order: [
      ['group', 'ASC'],
      ['subject', 'ASC'],
      ['action', 'ASC'],
    ],
  });
  const grants = await RolePermission.findAll();
  const grantMap = { admin_unit: [] };
  grants.forEach((row) => {
    if (!grantMap[row.role]) grantMap[row.role] = [];
    grantMap[row.role].push(row.permissionId);
  });
  return { roles: MATRIX_ROLES, permissions, grants: grantMap };
}

async function syncRole(role, permissionIds) {
  if (role === 'superadmin') {
    throw new AppError('Permission superadmin tidak dapat diubah', 422);
  }
  if (role !== 'admin_unit') {
    throw new AppError('Peran tidak valid', 422);
  }
  const uniqueIds = [...new Set((permissionIds || []).map(Number))];
  return sequelize.transaction(async (transaction) => {
    if (uniqueIds.length) {
      const found = await Permission.findAll({ where: { id: uniqueIds }, transaction });
      if (found.length !== uniqueIds.length) throw new AppError('Sebagian permission tidak ditemukan', 422);
    }
    await RolePermission.destroy({ where: { role }, transaction });
    if (uniqueIds.length) {
      await RolePermission.bulkCreate(
        uniqueIds.map((permissionId) => ({ role, permissionId })),
        { transaction },
      );
    }
    logger.info({ role, count: uniqueIds.length }, 'Role permissions synced');
    return getMatrix();
  });
}

async function ensureCatalog() {
  const catalog = buildCatalog();
  const existing = await Permission.findAll({ attributes: ['name'] });
  const have = new Set(existing.map((item) => item.name));
  const missing = catalog.filter((item) => !have.has(item.name));
  if (missing.length) {
    await Permission.bulkCreate(missing.map(({ key, ...rest }) => rest));
  }
  return Permission.findAll({ order: [['id', 'ASC']] });
}

module.exports = { list, getMatrix, syncRole, ensureCatalog, MATRIX_ROLES };
