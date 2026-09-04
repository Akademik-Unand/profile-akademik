const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

async function assertUniqueInUnit(Model, { unitId, slug, excludeId, message }) {
  const where = { slug, unitId: unitId ?? null };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const found = await Model.findOne({ where });
  if (found) throw new AppError(message, 422);
}

module.exports = { assertUniqueInUnit };
