import { blockMatchesQuery } from './blockSearch';

describe('blockMatchesQuery', () => {
  it('matches label, type, and description', () => {
    expect(blockMatchesQuery('Section', '')).toBe(true);
    expect(blockMatchesQuery('Section', 'wadah')).toBe(true);
    expect(blockMatchesQuery('Heading', 'judul')).toBe(true);
    expect(blockMatchesQuery('Heading', 'youtube')).toBe(false);
  });
});
