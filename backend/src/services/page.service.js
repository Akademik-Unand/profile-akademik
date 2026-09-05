const { Page, Unit } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const {
  applyUnitScope,
  applyListUnitFilter,
  assertUnitAccess,
  resolveCreateUnitId,
  findPublishedBySlug,
} = require('../helpers/unitScope');
const { assertUniqueInUnit } = require('../helpers/uniqueScope');
const { sanitizeHtml } = require('../helpers/sanitizeHtml');
const { normalizeBuilder, layoutFromBuilder, htmlToBuilder, withBuilderFallback } = require('../helpers/builderDocument');
const logger = require('../utils/logger');

function prepareBuilderPayload(payload) {
  const next = { ...payload };
  if (next.content) next.content = sanitizeHtml(next.content);
  if (next.builder) {
    next.builder = normalizeBuilder(next.builder);
    next.layout = layoutFromBuilder(next.builder, next.layout);
  } else if (next.content) {
    next.builder = htmlToBuilder(next.content, next.layout);
    next.layout = layoutFromBuilder(next.builder, next.layout);
  }
  return next;
}

function uniqueOrThrow(error, message) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new AppError(message, 422);
  }
  throw error;
}

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);
  if (query.status) extraWhere.status = query.status;

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['title', 'slug'],
    sortableFields: ['title', 'slug', 'createdAt', 'updatedAt', 'publishedAt', 'status'],
    extraWhere,
  });

  const { rows, count } = await Page.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug', 'isDefault'] }],
  });
  return { items: rows, page, limit, total: count };
}

async function getById(id, currentUser) {
  const page = await Page.findByPk(id, {
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug', 'isDefault'] }],
  });
  if (!page) throw new AppError('Halaman tidak ditemukan', 404);
  assertUnitAccess(currentUser, page.unitId);
  return page;
}

async function getPublicBySlug(unitSlug, pageSlug) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const page = await findPublishedBySlug(Page, unit, pageSlug);
  if (!page) throw new AppError('Halaman tidak ditemukan', 404);
  return { unit, page: withBuilderFallback(page) };
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  await assertUniqueInUnit(Page, {
    unitId,
    slug: payload.slug,
    message: 'Slug halaman sudah dipakai di lingkup ini',
  });
  const status = payload.status || 'draft';
  try {
    const prepared = prepareBuilderPayload(payload);
    const page = await Page.create({
      ...prepared,
      unitId,
      content: prepared.content || '',
      status,
      createdBy: currentUser.id,
      publishedAt: status === 'published' ? payload.publishedAt || new Date() : payload.publishedAt || null,
    });
    logger.info({ pageId: page.id, unitId }, 'Page created');
    return page;
  } catch (error) {
    uniqueOrThrow(error, 'Slug halaman sudah dipakai di lingkup ini');
  }
}

async function update(id, payload, currentUser) {
  const page = await getById(id, currentUser);
  if (Object.prototype.hasOwnProperty.call(payload, 'unitId')) {
    assertUnitAccess(currentUser, payload.unitId);
  }
  const nextUnitId = Object.prototype.hasOwnProperty.call(payload, 'unitId') ? payload.unitId : page.unitId;
  const nextSlug = payload.slug || page.slug;
  await assertUniqueInUnit(Page, {
    unitId: nextUnitId,
    slug: nextSlug,
    excludeId: page.id,
    message: 'Slug halaman sudah dipakai di lingkup ini',
  });
  const nextStatus = payload.status ?? page.status;
  const publishedAt =
    nextStatus === 'published' && !page.publishedAt && !payload.publishedAt
      ? new Date()
      : payload.publishedAt !== undefined
        ? payload.publishedAt
        : page.publishedAt;
  try {
    const prepared = prepareBuilderPayload(payload);
    await page.update({ ...prepared, publishedAt });
    logger.info({ pageId: page.id }, 'Page updated');
    return withBuilderFallback(page);
  } catch (error) {
    uniqueOrThrow(error, 'Slug halaman sudah dipakai di lingkup ini');
  }
}

async function remove(id, currentUser) {
  const page = await getById(id, currentUser);
  await page.destroy();
  logger.info({ pageId: id }, 'Page deleted');
}

module.exports = { listAdmin, getById, getPublicBySlug, create, update, remove };
