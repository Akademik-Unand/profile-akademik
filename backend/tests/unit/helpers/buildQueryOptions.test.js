const buildQueryOptions = require('../../../src/helpers/buildQueryOptions');

describe('buildQueryOptions', () => {
  it('applies defaults and whitelist sort', () => {
    const result = buildQueryOptions({}, { sortableFields: ['name', 'createdAt'] });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.order).toEqual([['createdAt', 'DESC']]);
  });

  it('ignores unwhitelisted sortBy', () => {
    const result = buildQueryOptions(
      { sortBy: 'DROP TABLE users', sortOrder: 'asc', page: 2, limit: 25 },
      { sortableFields: ['name'] },
    );
    expect(result.order).toEqual([['createdAt', 'ASC']]);
    expect(result.offset).toBe(25);
    expect(result.limit).toBe(25);
  });

  it('adds search OR clauses for searchable fields', () => {
    const result = buildQueryOptions(
      { search: 'akademik' },
      { searchableFields: ['name', 'slug'] },
    );
    expect(result.where.Op || result.where).toBeTruthy();
    const orKey = Object.getOwnPropertySymbols(result.where)[0];
    expect(result.where[orKey]).toHaveLength(2);
  });
});
