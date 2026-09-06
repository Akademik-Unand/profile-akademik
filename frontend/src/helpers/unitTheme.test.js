import { darkenHex, normalizeHex, unitThemeStyle } from './unitTheme';

describe('unitTheme', () => {
  it('normalizes 3-digit and 6-digit hex', () => {
    expect(normalizeHex('#1a8')).toBe('#11aa88');
    expect(normalizeHex('#1E3A8A')).toBe('#1e3a8a');
    expect(normalizeHex('blue')).toBe('');
  });

  it('darkens a hex toward black', () => {
    expect(darkenHex('#ffffff', 0.5)).toBe('#808080');
    expect(darkenHex('nope', 0.5)).toBe('');
  });

  it('maps a unit color onto navbar, hero, and footer tokens', () => {
    expect(unitThemeStyle('#1e3a8a')).toEqual({
      '--color-primary': '#1e3a8a',
      '--color-primary-hover': darkenHex('#1e3a8a', 0.16),
      '--color-hero': darkenHex('#1e3a8a', 0.38),
      '--color-hero-footer': darkenHex('#1e3a8a', 0.22),
    });
    expect(unitThemeStyle('')).toBeUndefined();
  });
});
