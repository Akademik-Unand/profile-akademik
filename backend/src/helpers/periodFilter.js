const { Op } = require('sequelize');

const PERIODS = ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'all'];

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function periodRange(period, now = new Date()) {
  if (!period || period === 'all') return null;

  const today = startOfDay(now);

  if (period === 'today') {
    return { [Op.gte]: today };
  }

  if (period === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return { [Op.gte]: yesterday, [Op.lt]: today };
  }

  if (period === 'this_week') {
    const start = new Date(today);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    return { [Op.gte]: start };
  }

  if (period === 'last_week') {
    const start = new Date(today);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1 - 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { [Op.gte]: start, [Op.lt]: end };
  }

  if (period === 'this_month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { [Op.gte]: start };
  }

  if (period === 'last_month') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 1);
    return { [Op.gte]: start, [Op.lt]: end };
  }

  return null;
}

module.exports = { PERIODS, periodRange };
