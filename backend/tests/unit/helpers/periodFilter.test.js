const { Op } = require('sequelize');
const { periodRange } = require('../../../src/helpers/periodFilter');

describe('periodRange', () => {
  const now = new Date('2026-09-04T12:00:00');

  it('returns null for all', () => {
    expect(periodRange('all', now)).toBeNull();
  });

  it('bounds today from local midnight', () => {
    const range = periodRange('today', now);
    expect(range[Op.gte].getHours()).toBe(0);
    expect(range[Op.gte].getDate()).toBe(now.getDate());
  });
});
