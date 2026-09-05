import { applyAnchor, inferAnchor, readAnchorXY } from './positionAnchor';

describe('positionAnchor', () => {
  it('infers a corner from which sides are filled', () => {
    expect(inferAnchor({ top: 8, right: 16 })).toBe('tr');
    expect(inferAnchor({ bottom: 4, left: 2 })).toBe('bl');
    expect(inferAnchor({})).toBe('tl');
  });

  it('writes X/Y onto the pinned sides', () => {
    expect(applyAnchor('br', 12, 20, 'px')).toEqual({
      top: '',
      right: 12,
      bottom: 20,
      left: '',
      unit: 'px',
    });
    expect(readAnchorXY(applyAnchor('tr', 8, 4, '%'))).toEqual({
      anchor: 'tr',
      x: 8,
      y: 4,
      unit: '%',
    });
  });
});
