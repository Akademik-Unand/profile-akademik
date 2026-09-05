import { showPuckField, showStyleSection } from './fieldPanel';

describe('showPuckField', () => {
  it('shows every field when search is empty', () => {
    expect(showPuckField('Gaya', '')).toBe(true);
    expect(showPuckField('Judul', '')).toBe(true);
    expect(showPuckField('Rata', '')).toBe(true);
  });

  it('filters by search', () => {
    expect(showPuckField('Judul', 'judul')).toBe(true);
    expect(showPuckField('Gaya', 'padding')).toBe(true);
    expect(showPuckField('Gaya', 'youtube')).toBe(false);
    expect(showPuckField('URL YouTube', 'video')).toBe(true);
    expect(showPuckField('Tampilan data', 'kartu')).toBe(true);
  });
});

describe('showStyleSection', () => {
  it('keeps all sections without a query and filters with one', () => {
    expect(showStyleSection('place', '')).toBe(true);
    expect(showStyleSection('padding', '')).toBe(true);
    expect(showStyleSection('padding', 'padding')).toBe(true);
    expect(showStyleSection('place', 'youtube')).toBe(false);
  });
});
