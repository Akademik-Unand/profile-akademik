const { Agenda, Unit } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const {
  applyUnitScope,
  applyListUnitFilter,
  assertUnitAccess,
  resolveCreateUnitId,
  contentWhereForUnit,
} = require('../helpers/unitScope');
const { assertUniqueInUnit } = require('../helpers/uniqueScope');
const logger = require('../utils/logger');

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
    searchableFields: ['title', 'slug', 'location'],
    sortableFields: ['title', 'slug', 'startsAt', 'createdAt', 'updatedAt', 'status'],
    extraWhere,
  });

  const { rows, count } = await Agenda.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  return { items: rows, page, limit, total: count };
}

async function listPublic(unitSlug, query = {}) {
  const unit = await Unit.findOne({ where: { slug: unitSlug, isActive: true } });
  if (!unit) throw new AppError('Unit tidak ditemukan', 404);
  const extraWhere = { ...contentWhereForUnit(unit), status: 'published' };
  const { where, order, limit, offset, page } = buildQueryOptions(
    { ...query, sortBy: query.sortBy || 'startsAt', sortOrder: query.sortOrder || 'asc' },
    {
      searchableFields: ['title', 'location'],
      sortableFields: ['startsAt', 'title', 'createdAt'],
      extraWhere,
    },
  );
  const { rows, count } = await Agenda.findAndCountAll({ where, order, limit, offset });
  return { items: rows, page, limit, total: count, unit };
}

async function getById(id, currentUser) {
  const agenda = await Agenda.findByPk(id, {
    include: [{ model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] }],
  });
  if (!agenda) throw new AppError('Agenda tidak ditemukan', 404);
  assertUnitAccess(currentUser, agenda.unitId);
  return agenda;
}

async function create(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  await assertUniqueInUnit(Agenda, {
    unitId,
    slug: payload.slug,
    message: 'Slug agenda sudah dipakai di lingkup ini',
  });
  try {
    const agenda = await Agenda.create({ ...payload, unitId, status: payload.status || 'draft' });
    logger.info({ agendaId: agenda.id, unitId }, 'Agenda created');
    return agenda;
  } catch (error) {
    uniqueOrThrow(error, 'Slug agenda sudah dipakai di lingkup ini');
  }
}

async function update(id, payload, currentUser) {
  const agenda = await getById(id, currentUser);
  if (Object.prototype.hasOwnProperty.call(payload, 'unitId')) {
    assertUnitAccess(currentUser, payload.unitId);
  }
  const nextUnitId = Object.prototype.hasOwnProperty.call(payload, 'unitId') ? payload.unitId : agenda.unitId;
  const nextSlug = payload.slug || agenda.slug;
  await assertUniqueInUnit(Agenda, {
    unitId: nextUnitId,
    slug: nextSlug,
    excludeId: agenda.id,
    message: 'Slug agenda sudah dipakai di lingkup ini',
  });
  try {
    await agenda.update(payload);
    logger.info({ agendaId: agenda.id }, 'Agenda updated');
    return agenda;
  } catch (error) {
    uniqueOrThrow(error, 'Slug agenda sudah dipakai di lingkup ini');
  }
}

async function remove(id, currentUser) {
  const agenda = await getById(id, currentUser);
  await agenda.destroy();
  logger.info({ agendaId: id }, 'Agenda deleted');
}

module.exports = { listAdmin, listPublic, getById, create, update, remove };
