const { OrganizationMember, Unit, Media } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const buildMenuTree = require('../helpers/menuTree');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId, contentWhereForUnit } = require('../helpers/unitScope');
const logger = require('../utils/logger');

const PHOTO = { model: Media, as: 'photo', attributes: ['id', 'url', 'thumbnailUrl', 'altText'] };

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'title'],
    sortableFields: ['name', 'title', 'order', 'createdAt', 'updatedAt'],
    extraWhere,
  });

  const { rows, count } = await OrganizationMember.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }, PHOTO],
  });
  return { items: rows, page, limit, total: count, tree: buildMenuTree(rows) };
}

async function listPublic(unitSlug) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const items = await OrganizationMember.findAll({
    where: contentWhereForUnit(unit),
    order: [['order', 'ASC'], ['id', 'ASC']],
    include: [PHOTO],
  });
  return { items: buildMenuTree(items), unit };
}

async function getById(id, currentUser) {
  const member = await OrganizationMember.findByPk(id, {
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }, PHOTO],
  });
  if (!member) throw new AppError('Anggota organisasi tidak ditemukan', 404);
  assertUnitAccess(currentUser, member.unitId);
  return member;
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  const member = await OrganizationMember.create({
    ...payload,
    unitId,
    order: payload.order ?? 0,
  });
  logger.info({ memberId: member.id, unitId }, 'Organization member created');
  return member;
}

async function update(id, payload, currentUser) {
  const member = await getById(id, currentUser);
  if (Object.prototype.hasOwnProperty.call(payload, 'unitId')) {
    assertUnitAccess(currentUser, payload.unitId);
  }
  await member.update(payload);
  logger.info({ memberId: member.id }, 'Organization member updated');
  return member;
}

async function remove(id, currentUser) {
  const member = await getById(id, currentUser);
  await member.destroy();
  logger.info({ memberId: id }, 'Organization member deleted');
}

module.exports = { listAdmin, listPublic, getById, create, update, remove };
