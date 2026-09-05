import { defaultBox, fillBox, SECTION_PADDING } from './layoutBox';

describe('defaultBox', () => {
  it('fills padding, margin, width, and height so fields are not blank', () => {
    const box = defaultBox();
    expect(box.padding).toEqual({ top: 16, right: 16, bottom: 16, left: 16, unit: 'px' });
    expect(box.margin).toEqual({ top: 0, right: 0, bottom: 0, left: 0, unit: 'px' });
    expect(box.width).toEqual({ value: 100, unit: '%' });
    expect(box.height).toEqual({ value: '', unit: 'auto' });
    expect(box.opacity).toBe(100);
    expect(box.shadow).toBe('none');
  });
});

describe('fillBox', () => {
  it('keeps typed values and fills blank sides from defaults', () => {
    const box = fillBox({
      padding: { top: '', right: 8, bottom: '', left: '', unit: 'px' },
      width: { value: '', unit: 'px' },
    });
    expect(box.padding.top).toBe(16);
    expect(box.padding.right).toBe(8);
    expect(box.width).toEqual({ value: 100, unit: '%' });
  });
});

describe('SECTION_PADDING', () => {
  it('matches the previous md token padding', () => {
    expect(SECTION_PADDING).toEqual({ top: 56, right: 24, bottom: 56, left: 24, unit: 'px' });
  });
});
