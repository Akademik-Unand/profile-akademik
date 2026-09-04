const { Post, PostCategory, Unit, Media } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const {
  applyUnitScope,
  applyListUnitFilter,
  assertUnitAccess,
  resolveCreateUnitId,
  contentWhereForUnit,
  findPublishedBySlug,
} = require('../helpers/unitScope');
const { assertUniqueInUnit } = require('../helpers/uniqueScope');
const { periodRange } = require('../helpers/periodFilter');
const logger = require('../utils/logger');

const COVER = { model: Media, as: 'cover', attributes: ['id', 'url', 'thumbnailUrl', 'altText'] };
const CATEGORY = { model: PostCategory, as: 'category', attributes: ['id', 'name', 'slug'] };

function uniqueOrThrow(error, message) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new AppError(message, 422);
  }
  throw error;
}

function listWhere(query, extraWhere) {
  if (query.status) extraWhere.status = query.status;
  if (query.categoryId) extraWhere.categoryId = Number(query.categoryId);
  if (query.featured === true || query.featured === 'true' || query.isFeatured === true || query.isFeatured === 'true') {
    extraWhere.isFeatured = true;
  }
  const publishedRange = periodRange(query.period);
  if (publishedRange) extraWhere.publishedAt = publishedRange;
  return extraWhere;
}

async function listAdmin(query, currentUser) {
  const extraWhere = listWhere(query, applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser));
  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['title', 'slug', 'excerpt'],
    sortableFields: ['title', 'slug', 'createdAt', 'updatedAt', 'publishedAt', 'status'],
    extraWhere,
  });
  const { rows, count } = await Post.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [CATEGORY, COVER, { model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  return { items: rows, page, limit, total: count };
}

async function listPublic(unitSlug, query) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);

  const extraWhere = listWhere(query, { ...contentWhereForUnit(unit), status: 'published' });
  if (query.category) {
    const category = await PostCategory.findOne({
      where: { slug: query.category, ...contentWhereForUnit(unit) },
    });
    if (!category) return { items: [], page: 1, limit: 10, total: 0 };
    extraWhere.categoryId = category.id;
  }

  const { where, order, limit, offset, page } = buildQueryOptions(
    { ...query, sortBy: query.sortBy || 'publishedAt', sortOrder: query.sortOrder || 'desc' },
    {
      searchableFields: ['title', 'slug', 'excerpt'],
      sortableFields: ['title', 'slug', 'createdAt', 'publishedAt'],
      extraWhere,
    },
  );

  const { rows, count } = await Post.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [CATEGORY, COVER],
  });
  return { items: rows, page, limit, total: count, unit };
}

async function getById(id, currentUser) {
  const post = await Post.findByPk(id, {
    include: [CATEGORY, COVER, { model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  if (!post) throw new AppError('Pengumuman tidak ditemukan', 404);
  assertUnitAccess(currentUser, post.unitId);
  return post;
}

async function getPublicBySlug(unitSlug, postSlug) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const post = await findPublishedBySlug(Post, unit, postSlug, { include: [CATEGORY, COVER] });
  if (!post) throw new AppError('Pengumuman tidak ditemukan', 404);
  return { unit, post };
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  await assertUniqueInUnit(Post, {
    unitId,
    slug: payload.slug,
    message: 'Slug pengumuman sudah dipakai di lingkup ini',
  });
  const status = payload.status || 'draft';
  try {
    const post = await Post.create({
      ...payload,
      unitId,
      content: payload.content || '',
      status,
      isFeatured: Boolean(payload.isFeatured),
      createdBy: currentUser.id,
      publishedAt: status === 'published' ? payload.publishedAt || new Date() : payload.publishedAt || null,
    });
    logger.info({ postId: post.id, unitId }, 'Post created');
    return getById(post.id, currentUser);
  } catch (error) {
    uniqueOrThrow(error, 'Slug pengumuman sudah dipakai di lingkup ini');
  }
}

async function update(id, payload, currentUser) {
  const post = await getById(id, currentUser);
  if (Object.prototype.hasOwnProperty.call(payload, 'unitId')) {
    assertUnitAccess(currentUser, payload.unitId);
  }
  const nextUnitId = Object.prototype.hasOwnProperty.call(payload, 'unitId') ? payload.unitId : post.unitId;
  const nextSlug = payload.slug || post.slug;
  await assertUniqueInUnit(Post, {
    unitId: nextUnitId,
    slug: nextSlug,
    excludeId: post.id,
    message: 'Slug pengumuman sudah dipakai di lingkup ini',
  });
  const nextStatus = payload.status ?? post.status;
  const publishedAt =
    nextStatus === 'published' && !post.publishedAt && !payload.publishedAt
      ? new Date()
      : payload.publishedAt !== undefined
        ? payload.publishedAt
        : post.publishedAt;
  try {
    await post.update({ ...payload, publishedAt });
    logger.info({ postId: post.id }, 'Post updated');
    return getById(post.id, currentUser);
  } catch (error) {
    uniqueOrThrow(error, 'Slug pengumuman sudah dipakai di lingkup ini');
  }
}

async function remove(id, currentUser) {
  const post = await getById(id, currentUser);
  await post.destroy();
  logger.info({ postId: id }, 'Post deleted');
}

module.exports = { listAdmin, listPublic, getById, getPublicBySlug, create, update, remove };
