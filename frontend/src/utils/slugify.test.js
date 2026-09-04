import { slugify } from './slugify';

describe('slugify', () => {
  it('turns a title into a url slug', () => {
    expect(slugify('Kalender Akademik 2026')).toBe('kalender-akademik-2026');
  });
});
