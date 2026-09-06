const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeHex(value) {
  const match = String(value || '').trim().match(HEX);
  if (!match) return '';
  const body = match[1];
  if (body.length === 3) {
    return `#${body
      .split('')
      .map((part) => `${part}${part}`)
      .join('')}`.toLowerCase();
  }
  return `#${body}`.toLowerCase();
}

function toRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function toHex({ r, g, b }) {
  const channel = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Campur hex ke hitam. `amount` 0 = warna asli, 1 = hitam. */
export function darkenHex(value, amount) {
  const hex = normalizeHex(value);
  if (!hex) return '';
  const rgb = toRgb(hex);
  return toHex({
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount),
  });
}

/**
 * Token publik dari warna tema unit: pita navbar, tautan, banner, footer.
 */
export function unitThemeStyle(themeColor) {
  const hex = normalizeHex(themeColor);
  if (!hex) return undefined;
  return {
    '--color-primary': hex,
    '--color-primary-hover': darkenHex(hex, 0.16),
    '--color-hero': darkenHex(hex, 0.38),
    '--color-hero-footer': darkenHex(hex, 0.22),
  };
}
