import { buttonBoxStyle } from './buttonStyle';

describe('buttonBoxStyle', () => {
  it('centers text and uses outline defaults', () => {
    const style = buttonBoxStyle('outline', {
      padding: { top: 10, right: 20, bottom: 10, left: 20, unit: 'px' },
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'primary',
      borderRadius: 6,
    });
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.paddingTop).toBe('10px');
    expect(style.borderRadius).toBe('6px');
    expect(style.backgroundColor).toBe('transparent');
  });

  it('fills a solid button when variant is fill', () => {
    const style = buttonBoxStyle('fill', {});
    expect(style.backgroundColor).toBe('#108652');
    expect(style.color).toBe('#ffffff');
  });
});
