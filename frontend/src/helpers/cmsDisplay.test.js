import { FALLBACK_UNIT_LOGO, datePartsId, formatDateId, payloadUnitId, unitLogoUrl, unitScopeName } from './cmsDisplay';

describe('unitLogoUrl', () => {
  it('uses unit logo when present', () => {
    expect(unitLogoUrl({ logo: { url: 'https://example.com/logo.png' } })).toBe('https://example.com/logo.png');
  });

  it('falls back to the UNAND emblem', () => {
    expect(unitLogoUrl({})).toBe(FALLBACK_UNIT_LOGO);
  });
});

describe('unitScopeName', () => {
  it('labels content without a unit as the main site', () => {
    expect(unitScopeName(null)).toBe('Situs utama');
    expect(unitScopeName({ name: 'Perpustakaan' })).toBe('Perpustakaan');
  });
});

describe('payloadUnitId', () => {
  it('sends null for an empty unit selection', () => {
    expect(payloadUnitId('')).toBeNull();
    expect(payloadUnitId(4)).toBe(4);
  });
});

describe('formatDateId', () => {
  it('formats an ISO date in Indonesian', () => {
    expect(formatDateId('2026-08-17T00:00:00.000Z', { day: 'numeric', month: 'long', year: 'numeric' })).toMatch(/2026/);
  });
});

describe('datePartsId', () => {
  it('splits a date into day, month, and year', () => {
    const parts = datePartsId('2026-09-04T00:00:00.000Z');
    expect(parts.day).toBeGreaterThan(0);
    expect(parts.month).toBeTruthy();
    expect(parts.year).toBe(2026);
  });
});
