import { periodRange, PERIODS } from './periodFilter';

describe('periodRange', () => {
  const now = new Date('2026-09-04T12:00:00');

  it('lists known periods', () => {
    expect(PERIODS).toContain('this_month');
  });

  it('returns null for all', () => {
    expect(periodRange('all', now)).toBeNull();
  });

  it('starts today at midnight', () => {
    const range = periodRange('today', now);
    expect(range.gte.getHours()).toBe(0);
    expect(range.gte.getDate()).toBe(4);
  });

  it('covers last month', () => {
    const range = periodRange('last_month', now);
    expect(range.gte.getMonth()).toBe(7);
    expect(range.lt.getMonth()).toBe(8);
  });
});
