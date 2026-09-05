const { sanitizeBox, sanitizeDisplay } = require('../../../src/helpers/sanitizeBox');

describe('sanitizeBox', () => {
  it('keeps numeric padding and palette colors', () => {
    const clean = sanitizeBox({
      backgroundColor: 'primary',
      padding: { top: 16, right: 32, bottom: 16, left: 32, unit: 'px' },
      position: 'absolute',
      offset: { top: 24, right: 24, unit: 'px' },
    });
    expect(clean.backgroundColor).toBe('primary');
    expect(clean.padding.top).toBe(16);
    expect(clean.position).toBe('absolute');
    expect(clean.offset.top).toBe(24);
  });

  it('rejects injection in width and color', () => {
    const clean = sanitizeBox({
      width: { value: '100vh; background: url(x)', unit: 'px; background:url(evil)' },
      backgroundColor: 'red; url(https://evil)',
      position: 'sticky; url(x)',
    });
    expect(clean.width.value).toBe('');
    expect(clean.width.unit).toBe('px');
    expect(clean.backgroundColor).toBe('');
    expect(clean.position).toBe('static');
  });

  it('keeps a safe border', () => {
    const clean = sanitizeBox({
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: 'primary',
      borderRadius: 8,
    });
    expect(clean.borderStyle).toBe('dashed');
    expect(clean.borderWidth).toBe(2);
    expect(clean.borderColor).toBe('primary');
    expect(clean.borderRadius).toBe(8);
  });

  it('drops illegal border values', () => {
    const clean = sanitizeBox({
      borderStyle: 'groove; url(x)',
      borderWidth: '10px; background:url(x)',
      borderColor: 'red url(x)',
    });
    expect(clean.borderStyle).toBe('none');
    expect(clean.borderWidth).toBe('');
    expect(clean.borderColor).toBe('');
  });

  it('keeps only a whitelisted font family', () => {
    expect(sanitizeBox({ fontFamily: 'Georgia, serif' }).fontFamily).toBe('Georgia, serif');
    expect(sanitizeBox({ fontFamily: 'Comic Sans, url(evil)' }).fontFamily).toBe('');
  });

  it('keeps rotate and flip', () => {
    expect(sanitizeBox({ rotate: 45, flipX: true }).rotate).toBe(45);
    expect(sanitizeBox({ rotate: 45, flipX: true }).flipX).toBe(true);
    expect(sanitizeBox({ rotate: '90deg; url(x)', flipX: 'yes' }).rotate).toBe(0);
    expect(sanitizeBox({ rotate: '90deg; url(x)', flipX: 'yes' }).flipX).toBe(false);
  });

  it('keeps a safe place', () => {
    expect(sanitizeBox({ placeX: 'center', placeY: 'bottom' }).placeX).toBe('center');
    expect(sanitizeBox({ placeX: 'center', placeY: 'bottom' }).placeY).toBe('bottom');
    expect(sanitizeBox({ placeX: 'float; url(x)', placeY: 'up' }).placeX).toBe('stretch');
    expect(sanitizeBox({ placeX: 'float; url(x)', placeY: 'up' }).placeY).toBe('top');
  });

  it('keeps sticky position', () => {
    expect(sanitizeBox({ position: 'sticky' }).position).toBe('sticky');
  });

  it('keeps opacity and a safe shadow', () => {
    const clean = sanitizeBox({ opacity: 40, shadow: 'lg' });
    expect(clean.opacity).toBe(40);
    expect(clean.shadow).toBe('lg');
    expect(sanitizeBox({ opacity: 400, shadow: 'glow; url(x)' }).opacity).toBe(100);
    expect(sanitizeBox({ shadow: 'glow; url(x)' }).shadow).toBe('none');
  });

  it('keeps a safe data display', () => {
    expect(sanitizeDisplay({ layout: 'cards', title: false, hack: true })).toEqual({
      layout: 'cards',
      title: false,
    });
    expect(sanitizeDisplay({ layout: 'masonry; url(x)', title: 'false' }).layout).toBe('list');
  });

  it('keeps auto height instead of collapsing it to 0', () => {
    expect(sanitizeBox({ height: { value: '', unit: 'auto' } }).height).toEqual({ value: '', unit: 'auto' });
    expect(sanitizeBox({ height: { value: 200, unit: 'px' } }).height).toEqual({ value: 200, unit: 'px' });
  });

  it('returns undefined for non-objects', () => {
    expect(sanitizeBox('width:100vh;background:url(x)')).toBeUndefined();
    expect(sanitizeBox(null)).toBeUndefined();
  });
});
