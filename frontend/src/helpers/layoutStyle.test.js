import { boxToMobileClass, boxToPlaceClass, boxToStyle, measureToCss, resolveColor, sanitizeBox, sanitizeNumber } from './layoutStyle';

describe('resolveColor', () => {
  it('maps palette tokens and hex', () => {
    expect(resolveColor('primary')).toBe('#108652');
    expect(resolveColor('#b7102a')).toBe('#b7102a');
    expect(resolveColor('red url(x)')).toBe('');
  });
});

describe('sanitizeBox', () => {
  it('drops NaN offsets so React never gets top: NaN', () => {
    const style = boxToStyle({
      position: 'relative',
      offset: { top: Number.NaN, left: 'nope', unit: 'px' },
    });
    expect(style.top).toBeUndefined();
    expect(style.left).toBeUndefined();
  });

  it('keeps auto height instead of collapsing it to 0px', () => {
    expect(sanitizeBox({ height: { value: '', unit: 'auto' } }).height).toEqual({ value: '', unit: 'auto' });
    expect(boxToStyle({ height: { value: '', unit: 'auto' } }).height).toBeUndefined();
    expect(boxToStyle({ height: { value: 0, unit: 'px' } }).height).toBeUndefined();
    expect(boxToStyle({ height: { value: 200, unit: 'px' } }).height).toBe('200px');
  });

  it('leaves blank numbers blank', () => {
    expect(sanitizeNumber('', 0, 240)).toBe('');
    expect(sanitizeNumber(null, 0, 240)).toBe('');
    expect(sanitizeNumber(0, 0, 240)).toBe(0);
  });

  it('drops illegal units and injection strings', () => {
    const clean = sanitizeBox({
      width: { value: '100vh; background: url(x)', unit: 'px; background:url(evil)' },
      backgroundColor: 'red; url(https://evil)',
      position: 'sticky; url(x)',
      padding: { top: 32, unit: 'px' },
    });
    expect(clean.width.value).toBe('');
    expect(clean.width.unit).toBe('px');
    expect(clean.backgroundColor).toBe('');
    expect(clean.position).toBe('static');
    expect(clean.padding.top).toBe(32);
  });
});

describe('boxToStyle', () => {
  it('builds padding, palette color, and absolute offsets', () => {
    const style = boxToStyle({
      backgroundColor: 'primary',
      padding: { top: 16, right: 32, bottom: 16, left: 32, unit: 'px' },
      position: 'absolute',
      offset: { top: 24, right: 24, bottom: '', left: '', unit: 'px' },
      zIndex: 4,
    });
    expect(style.backgroundColor).toBe('#108652');
    expect(style.paddingTop).toBe('16px');
    expect(style.paddingRight).toBe('32px');
    expect(style.position).toBe('absolute');
    expect(style.top).toBe('24px');
    expect(style.right).toBe('24px');
    expect(style.zIndex).toBe(4);
  });

  it('uses relative as the section default when box is static', () => {
    expect(boxToStyle({}, { defaultPosition: 'relative' }).position).toBe('relative');
  });

  it('turns a measure into CSS', () => {
    expect(measureToCss({ value: 24, unit: 'px' })).toBe('24px');
    expect(measureToCss({ value: 'nope', unit: 'px' })).toBe('');
  });

  it('applies border style, width, color, and radius', () => {
    const style = boxToStyle({
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: 'primary',
      borderRadius: 8,
    });
    expect(style.borderStyle).toBe('dashed');
    expect(style.borderWidth).toBe('2px');
    expect(style.borderColor).toBe('#108652');
    expect(style.borderRadius).toBe('8px');
  });

  it('keeps whitelisted fonts only', () => {
    expect(boxToStyle({ fontFamily: 'Georgia, serif' }).fontFamily).toBe('Georgia, serif');
    expect(boxToStyle({ fontFamily: 'Comic Sans, url(x)' }).fontFamily).toBeUndefined();
  });

  it('keeps fixed on the public page and contains it in the editor', () => {
    expect(boxToStyle({ position: 'fixed', offset: { top: 8, unit: 'px' } }).position).toBe('fixed');
    expect(boxToStyle({ position: 'fixed', offset: { top: 8, unit: 'px' } }, { containFixed: true }).position).toBe(
      'absolute',
    );
  });

  it('applies opacity and shadow presets', () => {
    const style = boxToStyle({ opacity: 50, shadow: 'md' });
    expect(style.opacity).toBe(0.5);
    expect(style.boxShadow).toBe('0 4px 14px rgb(15 23 42 / 0.1)');
    expect(boxToStyle({ opacity: 100, shadow: 'none' }).opacity).toBeUndefined();
    expect(boxToStyle({ shadow: 'drop; url(x)' }).boxShadow).toBeUndefined();
  });
});

describe('boxToStyle rotate and flip', () => {
  it('builds transform from rotate and flip', () => {
    expect(boxToStyle({ rotate: 15, flipX: true }).transform).toBe('rotate(15deg) scaleX(-1)');
    expect(boxToStyle({ rotate: 0, flipX: false }).transform).toBeUndefined();
  });
});

describe('boxToPlaceClass', () => {
  it('shrinks and centers a block that is not full width', () => {
    expect(boxToPlaceClass({ placeX: 'center', placeY: 'middle' })).toContain('self-center');
    expect(boxToPlaceClass({ placeX: 'center', placeY: 'middle' })).toContain('my-auto');
    expect(boxToPlaceClass({ placeX: 'stretch', placeY: 'top' })).toBe('');
    expect(boxToPlaceClass({ placeX: 'right', placeY: 'bottom' })).toContain('self-end');
    expect(boxToPlaceClass({ placeX: 'right', placeY: 'bottom' })).toContain('mt-auto');
  });
});

describe('boxToMobileClass', () => {
  it('resets absolute on small screens unless opted in', () => {
    expect(boxToMobileClass({ position: 'absolute' })).toBe('box-static-mobile');
    expect(boxToMobileClass({ position: 'absolute', keepPositionOnMobile: true })).toBe('');
    expect(boxToMobileClass({ position: 'relative' })).toBe('');
  });
});
