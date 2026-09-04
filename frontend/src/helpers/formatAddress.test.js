import { formatAddressLines } from './formatAddress';

describe('formatAddressLines', () => {
  it('splits a long address on commas', () => {
    expect(
      formatAddressLines('Lantai Dasar Gedung Rektorat, Jl. Dr. Mohammad Hatta, Padang, Indonesia'),
    ).toEqual(['Lantai Dasar Gedung Rektorat', 'Jl. Dr. Mohammad Hatta', 'Padang', 'Indonesia']);
  });

  it('returns an empty list for blank input', () => {
    expect(formatAddressLines('')).toEqual([]);
    expect(formatAddressLines(null)).toEqual([]);
  });
});
