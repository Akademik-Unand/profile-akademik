import { ALIGN_CLASS, ALIGN_PLACE_CLASS, isCustomColor, sectionClass } from './tokens';

describe('sectionClass', () => {
  it('combines theme background, padding, and margin', () => {
    expect(sectionClass('mist', 'lg', 'sm')).toContain('bg-mist');
    expect(sectionClass('mist', 'lg', 'sm')).toContain('py-20');
    expect(sectionClass('mist', 'lg', 'sm')).toContain('my-4');
  });
});

describe('ALIGN_CLASS', () => {
  it('covers left, center, right, and justify', () => {
    expect(ALIGN_CLASS.right).toBe('text-right');
    expect(ALIGN_CLASS.justify).toBe('text-justify');
    expect(ALIGN_PLACE_CLASS.right).toBe('ml-auto');
  });
});

describe('isCustomColor', () => {
  it('accepts hex colors only', () => {
    expect(isCustomColor('#108652')).toBe(true);
    expect(isCustomColor('mist')).toBe(false);
  });
});
