const { Op } = require('sequelize');
const { Unit, Media, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { assertUnitAccess, isSuperadmin } = require('../helpers/unitScope');
const logger = require('../utils/logger');
const { listPublicForUnit } = require('./menu.service');
const landingService = require('./landing.service');

const MEDIA = { model: Media, as: 'logo', attributes: ['id', 'url', 'thumbnailUrl', 'altText'] };
const COVER = { model: Media, as: 'cover', attributes: ['id', 'url', 'thumbnailUrl', 'altText'] };

const PUBLIC_ATTRIBUTES = [
  'id',
  'slug',
  'name',
  'themeColor',
  'templateKey',
  'isActive',
  'isDefault',
  'logoMediaId',
  'coverMediaId',
  'address',
  'phone',
  'fax',
  'email',
  'facebookUrl',
  'instagramUrl',
  'twitterUrl',
  'youtubeUrl',
  'tiktokUrl',
  'linkedinUrl',
  'description',
  'seoTitle',
  'seoDescription',
  'seoKeywords',
];

function applyActorScope(extraWhere, currentUser) {
  if (currentUser && currentUser.role !== 'superadmin') {
    extraWhere.id = { [Op.in]: currentUser.unitIds || [] };
  }
  return extraWhere;
}

async function listPublic(query) {
  const extraWhere = { isActive: true };
  if (query.isDefault === true) {
    extraWhere.isDefault = true;
  }

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'slug'],
    sortableFields: ['name', 'slug', 'createdAt'],
    extraWhere,
  });

  const { rows, count } = await Unit.findAndCountAll({
    where,
    order,
    limit,
    offset,
    attributes: PUBLIC_ATTRIBUTES,
    include: [MEDIA, COVER],
  });

  return { items: rows, page, limit, total: count };
}

async function getBySlug(slug) {
  const unit = await Unit.findOne({
    where: { slug, isActive: true },
    attributes: PUBLIC_ATTRIBUTES,
    include: [MEDIA, COVER],
  });
  if (!unit) {
    throw new AppError('Unit tidak ditemukan', 404);
  }
  const json = unit.toJSON();
  json.menus = await listPublicForUnit(unit, 'header');
  json.footerMenus = await listPublicForUnit(unit, 'footer');
  json.landing = await landingService.getPublicForUnit(unit);
  return json;
}

async function listAdmin(query, currentUser) {
  const extraWhere = {};
  if (typeof query.isActive === 'boolean') {
    extraWhere.isActive = query.isActive;
  }
  applyActorScope(extraWhere, currentUser);

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['name', 'slug'],
    sortableFields: ['name', 'slug', 'createdAt', 'updatedAt', 'isActive', 'isDefault'],
    extraWhere,
  });

  const { rows, count } = await Unit.findAndCountAll({ where, order, limit, offset });
  return { items: rows, page, limit, total: count };
}

async function getById(id, currentUser) {
  const unit = await Unit.findByPk(id, { include: [MEDIA, COVER] });
  if (!unit) {
    throw new AppError('Unit tidak ditemukan', 404);
  }
  if (currentUser.role !== 'superadmin' && !(currentUser.unitIds || []).includes(unit.id)) {
    throw new AppError('Anda tidak memiliki izin untuk aksi ini', 403);
  }
  return unit;
}

async function create(payload) {
  return sequelize.transaction(async (transaction) => {
    if (payload.isDefault) {
      await Unit.update({ isDefault: false }, { where: { isDefault: true }, transaction });
    }
    const unit = await Unit.create(payload, { transaction });
    logger.info({ unitId: unit.id, slug: unit.slug }, 'Unit created');
    return unit;
  });
}

async function update(id, payload, currentUser) {
  return sequelize.transaction(async (transaction) => {
    const unit = await Unit.findByPk(id, { transaction });
    if (!unit) {
      throw new AppError('Unit tidak ditemukan', 404);
    }
    assertUnitAccess(currentUser, unit.id);
    const next = { ...payload };
    if (!isSuperadmin(currentUser)) {
      delete next.isDefault;
      delete next.isActive;
    }
    if (next.isDefault === false && unit.isDefault) {
      throw new AppError('Tidak dapat menonaktifkan status default tanpa menunjuk unit lain', 422);
    }
    if (next.isDefault === true && !unit.isDefault) {
      await Unit.update({ isDefault: false }, { where: { isDefault: true }, transaction });
    }
    await unit.update(next, { transaction });
    logger.info({ unitId: unit.id }, 'Unit updated');
    return unit;
  });
}

async function remove(id) {
  const unit = await Unit.findByPk(id);
  if (!unit) {
    throw new AppError('Unit tidak ditemukan', 404);
  }
  if (unit.isDefault) {
    throw new AppError('Unit default tidak dapat dihapus', 422);
  }
  await unit.destroy();
  logger.info({ unitId: id }, 'Unit deleted');
}

module.exports = {
  listPublic,
  getBySlug,
  listAdmin,
  getById,
  create,
  update,
  remove,
};
