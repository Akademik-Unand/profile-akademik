const { Op } = require('sequelize');

function buildQueryOptions(query, { searchableFields = [], sortableFields = [], extraWhere = {} } = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const sortBy = sortableFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = String(query.sortOrder || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const where = { ...extraWhere };

  if (query.search && searchableFields.length > 0) {
    where[Op.or] = searchableFields.map((field) => ({
      [field]: { [Op.like]: `%${query.search}%` },
    }));
  }

  return {
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    page,
  };
}

module.exports = buildQueryOptions;
