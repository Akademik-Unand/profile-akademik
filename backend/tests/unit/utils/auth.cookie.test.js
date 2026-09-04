const { expiresInToMs, cookieOptions } = require('../../../src/utils/auth');

describe('auth cookie helpers', () => {
  it('parses duration strings to milliseconds', () => {
    expect(expiresInToMs('7d')).toBe(7 * 24 * 60 * 60 * 1000);
    expect(expiresInToMs('15m')).toBe(15 * 60 * 1000);
  });

  it('sets a persistent cookie, not a session cookie', () => {
    const options = cookieOptions();
    expect(options.httpOnly).toBe(true);
    expect(options.path).toBe('/');
    expect(options.maxAge).toBeGreaterThan(0);
    expect(options.expires).toBeInstanceOf(Date);
    expect(options.expires.getTime()).toBeGreaterThan(Date.now());
  });
});
