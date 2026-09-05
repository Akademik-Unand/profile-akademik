import { boxToStyle, resolveColor } from './layoutStyle';

/**
 * Gaya tombol: isi / garis / teks, lalu box menimpa nilai yang diisi user.
 */
export function buttonBoxStyle(variant, box = {}) {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2,
    boxSizing: 'border-box',
    textDecoration: 'none',
    ...boxToStyle(box),
  };

  if (variant === 'fill') {
    if (!box?.backgroundColor) style.backgroundColor = resolveColor('primary');
    if (!box?.color) style.color = '#ffffff';
    if (!box?.borderColor) style.borderColor = style.backgroundColor;
  }

  if (variant === 'ghost') {
    style.borderStyle = 'none';
    style.borderWidth = '0px';
    if (!box?.color) style.color = resolveColor('primary');
    if (!box?.backgroundColor) style.backgroundColor = 'transparent';
  }

  if (variant === 'outline' || !variant) {
    if (!box?.color) style.color = resolveColor(box?.borderColor || 'primary') || resolveColor('primary');
    if (!box?.backgroundColor) style.backgroundColor = 'transparent';
  }

  return style;
}
