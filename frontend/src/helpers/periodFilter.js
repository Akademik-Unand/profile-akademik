export const PERIODS = ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'all'];

export const PERIOD_LABELS = {
  all: 'Semua periode',
  today: 'Hari ini',
  yesterday: 'Kemarin',
  this_week: 'Minggu ini',
  last_week: 'Minggu lalu',
  this_month: 'Bulan ini',
  last_month: 'Bulan lalu',
};

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Rentang tanggal untuk query `period` listing pengumuman. */
export function periodRange(period, now = new Date()) {
  if (!period || period === 'all') return null;

  const today = startOfDay(now);

  if (period === 'today') {
    return { gte: today };
  }

  if (period === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return { gte: yesterday, lt: today };
  }

  if (period === 'this_week') {
    const start = new Date(today);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    return { gte: start };
  }

  if (period === 'last_week') {
    const start = new Date(today);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1 - 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { gte: start, lt: end };
  }

  if (period === 'this_month') {
    return { gte: new Date(today.getFullYear(), today.getMonth(), 1) };
  }

  if (period === 'last_month') {
    return {
      gte: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      lt: new Date(today.getFullYear(), today.getMonth(), 1),
    };
  }

  return null;
}
