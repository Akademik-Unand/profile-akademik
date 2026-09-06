const { Op } = require('sequelize');
const { sequelize, ContentType, ContentTypeVersion, ContentEntry, Unit, Media } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId, contentWhereForUnit } = require('../helpers/unitScope');
const { scopeKey } = require('../helpers/contentScope');
const { normalizeSchema, validateEntryData, assertCompatibleSchema, publicData } = require('../helpers/dynamicSchema');
const { normalizeBuilder } = require('../helpers/builderDocument');

function notFound(label) { throw new AppError(`${label} tidak ditemukan`, 404); }
async function getType(id, user) {
  const type = await ContentType.findByPk(id, { include: [{ model: ContentTypeVersion, as: 'versions' }] });
  if (!type) notFound('Jenis data');
  assertUnitAccess(user, type.unitId);
  return type;
}
async function activeSchema(type, transaction) {
  if (!type.activeVersion) throw new AppError('Schema belum dipublikasikan', 422);
  const version = await ContentTypeVersion.findOne({ where: { contentTypeId: type.id, version: type.activeVersion, status: 'published' }, transaction });
  if (!version) throw new AppError('Schema aktif tidak ditemukan', 422);
  return version;
}
async function validateMediaScope(schema, data, unitId) {
  const ids = [];
  const walk = (fields, row) => fields.forEach((field) => {
    const value = row?.[field.key];
    if (field.type === 'media' && value) ids.push(Number(value));
    if (field.type === 'repeater' && Array.isArray(value)) value.forEach((child) => walk(field.fields, child));
  });
  walk(schema.fields, data);
  if (!ids.length) return;
  const where = { id: { [Op.in]: [...new Set(ids)] }, unitId };
  if (unitId === null) where.unitId = null;
  const count = await Media.count({ where });
  if (count !== new Set(ids).size) throw new AppError('Media tidak ditemukan atau berada di unit lain', 422);
}

async function listTypes(query, user) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, user), query, user);
  const options = buildQueryOptions(query, { searchableFields: ['name', 'key'], sortableFields: ['name', 'key', 'createdAt', 'updatedAt'], extraWhere });
  const { rows, count } = await ContentType.findAndCountAll({ where: options.where, order: options.order, limit: options.limit, offset: options.offset, include: [{ model: ContentTypeVersion, as: 'versions' }] });
  return { items: rows, page: options.page, limit: options.limit, total: count };
}
async function createType(payload, user) {
  const unitId = resolveCreateUnitId(user, payload.unitId);
  const typeId = await sequelize.transaction(async (transaction) => {
    const exists = await ContentType.findOne({ where: { scopeKey: scopeKey(unitId), key: payload.key }, transaction });
    if (exists) throw new AppError('Key jenis data sudah dipakai di lingkup ini', 422);
    const schema = normalizeSchema(payload.schema);
    const type = await ContentType.create({ unitId, scopeKey: scopeKey(unitId), key: payload.key, name: payload.name, description: payload.description, listTemplate: payload.listTemplate ? normalizeBuilder(payload.listTemplate) : null, detailTemplate: payload.detailTemplate ? normalizeBuilder(payload.detailTemplate) : null, createdBy: user.id }, { transaction });
    await ContentTypeVersion.create({ contentTypeId: type.id, version: 1, schema, createdBy: user.id }, { transaction });
    return type.id;
  });
  return getType(typeId, user);
}
async function updateType(id, payload, user) {
  const type = await getType(id, user);
  const next = { ...payload };
  delete next.unitId; delete next.key; delete next.schema;
  if (next.listTemplate) next.listTemplate = normalizeBuilder(next.listTemplate);
  if (next.detailTemplate) next.detailTemplate = normalizeBuilder(next.detailTemplate);
  await type.update(next);
  return type;
}
async function createVersion(id, schemaPayload, user) {
  const type = await getType(id, user);
  const latest = await ContentTypeVersion.findOne({ where: { contentTypeId: id }, order: [['version', 'DESC']] });
  if (latest?.status === 'draft') throw new AppError('Publikasikan atau hapus draft schema yang ada terlebih dahulu', 422);
  const schema = normalizeSchema(schemaPayload);
  if (type.activeVersion) {
    const active = await activeSchema(type);
    assertCompatibleSchema(active.schema, schema);
  }
  return ContentTypeVersion.create({ contentTypeId: id, version: (latest?.version || 0) + 1, schema, createdBy: user.id });
}
async function publishVersion(id, versionNumber, user) {
  const type = await getType(id, user);
  const version = await ContentTypeVersion.findOne({ where: { contentTypeId: id, version: versionNumber } });
  if (!version) notFound('Versi schema');
  if (type.activeVersion) assertCompatibleSchema((await activeSchema(type)).schema, version.schema);
  return sequelize.transaction(async (transaction) => {
    await version.update({ status: 'published', publishedAt: new Date() }, { transaction });
    await type.update({ activeVersion: version.version }, { transaction });
    return version;
  });
}
async function listEntries(typeId, query, user) {
  const type = await getType(typeId, user);
  const extraWhere = { contentTypeId: type.id, unitId: type.unitId };
  if (query.status) extraWhere.status = query.status;
  const options = buildQueryOptions(query, { searchableFields: ['title', 'slug'], sortableFields: ['title', 'slug', 'status', 'publishedAt', 'createdAt', 'updatedAt'], extraWhere });
  const { rows, count } = await ContentEntry.findAndCountAll({ where: options.where, order: options.order, limit: options.limit, offset: options.offset });
  return { items: rows, page: options.page, limit: options.limit, total: count };
}
async function getEntry(typeId, id, user) {
  const type = await getType(typeId, user);
  const entry = await ContentEntry.findOne({ where: { id, contentTypeId: type.id, unitId: type.unitId } });
  if (!entry) notFound('Entri');
  return entry;
}
async function createEntry(typeId, payload, user) {
  const type = await getType(typeId, user);
  const version = await activeSchema(type);
  const data = validateEntryData(version.schema, payload.data);
  await validateMediaScope(version.schema, data, type.unitId);
  const exists = await ContentEntry.findOne({ where: { contentTypeId: type.id, scopeKey: type.scopeKey, slug: payload.slug } });
  if (exists) throw new AppError('Slug entri sudah dipakai', 422);
  const status = payload.status || 'draft';
  return ContentEntry.create({ unitId: type.unitId, scopeKey: type.scopeKey, contentTypeId: type.id, schemaVersion: version.version, slug: payload.slug, title: payload.title, status, data, createdBy: user.id, publishedAt: status === 'published' ? new Date() : null });
}
async function updateEntry(typeId, id, payload, user) {
  const type = await getType(typeId, user);
  const entry = await getEntry(typeId, id, user);
  const version = await activeSchema(type);
  const data = payload.data ? validateEntryData(version.schema, payload.data) : entry.data;
  await validateMediaScope(version.schema, data, type.unitId);
  if (payload.slug && payload.slug !== entry.slug) {
    const exists = await ContentEntry.findOne({ where: { contentTypeId: type.id, scopeKey: type.scopeKey, slug: payload.slug, id: { [Op.ne]: entry.id } } });
    if (exists) throw new AppError('Slug entri sudah dipakai', 422);
  }
  const status = payload.status || entry.status;
  await entry.update({ ...payload, data, schemaVersion: version.version, publishedAt: status === 'published' ? entry.publishedAt || new Date() : null });
  return entry;
}
async function removeEntry(typeId, id, user) { const entry = await getEntry(typeId, id, user); await entry.destroy(); }

async function publicType(unitSlug, key) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) notFound('Unit');
  const type = await ContentType.findOne({ where: { key, ...contentWhereForUnit(unit) }, order: [['updatedAt', 'DESC']] });
  if (!type || !type.activeVersion) notFound('Jenis data');
  return { unit, type, version: await activeSchema(type) };
}
function publicEntry(entry, version) { const json = entry.toJSON(); json.data = publicData(version.schema, json.data); return json; }
async function listPublic(unitSlug, key, query) {
  const { type, version } = await publicType(unitSlug, key);
  const schemaFields = new Map(version.schema.fields.map((field) => [field.key, field]));
  if (query.filterField && !schemaFields.get(query.filterField)?.filterable) throw new AppError('Field filter tidak diizinkan', 422);
  if (query.dataSort && !schemaFields.get(query.dataSort)?.sortable) throw new AppError('Field sort tidak diizinkan', 422);
  const where = { contentTypeId: type.id, unitId: type.unitId, status: 'published', publishedAt: { [Op.lte]: new Date() } };
  const limit = Math.min(Number(query.limit) || 10, 100); const page = Number(query.page) || 1;
  const options = { where, limit, offset: (page - 1) * limit, order: [['publishedAt', query.sortOrder === 'asc' ? 'ASC' : 'DESC']] };
  if (query.search) options.where[Op.or] = [{ title: { [Op.like]: `%${query.search}%` } }, { slug: { [Op.like]: `%${query.search}%` } }];
  const { rows, count } = await ContentEntry.findAndCountAll(options);
  let items = rows.map((entry) => publicEntry(entry, version));
  if (query.filterField) items = items.filter((entry) => String(entry.data[query.filterField]) === String(query.filterValue));
  if (query.dataSort) items.sort((a, b) => String(a.data[query.dataSort] ?? '').localeCompare(String(b.data[query.dataSort] ?? '')) * (query.sortOrder === 'desc' ? -1 : 1));
  return { contentType: type, items, page, limit, total: count };
}
async function getPublic(unitSlug, key, slug) {
  const { type, version } = await publicType(unitSlug, key);
  const entry = await ContentEntry.findOne({ where: { contentTypeId: type.id, unitId: type.unitId, slug, status: 'published', publishedAt: { [Op.lte]: new Date() } } });
  if (!entry) notFound('Entri');
  return { contentType: type, entry: publicEntry(entry, version) };
}
module.exports = { listTypes, getType, createType, updateType, createVersion, publishVersion, listEntries, getEntry, createEntry, updateEntry, removeEntry, listPublic, getPublic };
