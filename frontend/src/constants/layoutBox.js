export const LAYOUT_UNITS = ['px', 'rem', '%', 'vh', 'vw', 'em'];
export const WIDTH_UNITS = ['px', 'rem', '%', 'auto'];
export const HEIGHT_UNITS = [...LAYOUT_UNITS, 'auto'];
export const LAYOUT_POSITIONS = [
  { label: 'Mengalir', value: 'static', hint: 'Ikut urutan blok, tidak geser.' },
  { label: 'Geser', value: 'relative', hint: 'Tetap di alur, bisa digeser X dan Y.' },
  { label: 'Bebas', value: 'absolute', hint: 'Lepas dari alur, di dalam Section induk.' },
  { label: 'Nempe gulir', value: 'sticky', hint: 'Nempel saat halaman digulir.' },
  { label: 'Nempe layar', value: 'fixed', hint: 'Nempel ke jendela. Di editor tetap di dalam kanvas.' },
];

export const POSITION_ANCHORS = [
  { id: 'tl', label: 'Kiri atas' },
  { id: 'tc', label: 'Tengah atas' },
  { id: 'tr', label: 'Kanan atas' },
  { id: 'ml', label: 'Kiri' },
  { id: 'mc', label: 'Tengah' },
  { id: 'mr', label: 'Kanan' },
  { id: 'bl', label: 'Kiri bawah' },
  { id: 'bc', label: 'Tengah bawah' },
  { id: 'br', label: 'Kanan bawah' },
];

export const PLACE_X_VALUES = ['stretch', 'left', 'center', 'right'];
export const PLACE_Y_VALUES = ['top', 'middle', 'bottom'];

export const PLACE_CELLS = [
  { id: 'left-top', x: 'left', y: 'top', label: 'Rapat kiri atas' },
  { id: 'center-top', x: 'center', y: 'top', label: 'Rapat tengah atas' },
  { id: 'right-top', x: 'right', y: 'top', label: 'Rapat kanan atas' },
  { id: 'left-middle', x: 'left', y: 'middle', label: 'Rapat kiri tengah' },
  { id: 'center-middle', x: 'center', y: 'middle', label: 'Rata tengah' },
  { id: 'right-middle', x: 'right', y: 'middle', label: 'Rapat kanan tengah' },
  { id: 'left-bottom', x: 'left', y: 'bottom', label: 'Rapat kiri bawah' },
  { id: 'center-bottom', x: 'center', y: 'bottom', label: 'Rapat tengah bawah' },
  { id: 'right-bottom', x: 'right', y: 'bottom', label: 'Rapat kanan bawah' },
];

export const COLOR_PALETTE = [
  { label: 'Primer', value: 'primary', hex: '#108652' },
  { label: 'Primer gelap', value: 'primary-hover', hex: '#0d6e44' },
  { label: 'Sekunder', value: 'secondary', hex: '#b7102a' },
  { label: 'Dasar', value: 'base', hex: '#f0f5ef' },
  { label: 'Putih', value: 'surface', hex: '#ffffff' },
  { label: 'Hijau gelap', value: 'hero', hex: '#0e3b2e' },
  { label: 'Footer', value: 'hero-footer', hex: '#0a4d2f' },
  { label: 'Netral', value: 'neutral-200', hex: '#e2e8f0' },
  { label: 'Abu', value: 'neutral-500', hex: '#64748b' },
  { label: 'Teks', value: 'neutral-900', hex: '#0f172a' },
];

export const PALETTE_HEX = Object.fromEntries(COLOR_PALETTE.map((item) => [item.value, item.hex]));

export const FONT_OPTIONS = [
  { label: 'Bawaan situs', value: '' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Manrope', value: 'Manrope, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
];

export const FONT_VALUES = FONT_OPTIONS.map((item) => item.value).filter(Boolean);

export const BORDER_STYLES = [
  { label: 'Tidak ada', value: 'none' },
  { label: 'Solid', value: 'solid' },
  { label: 'Putus-putus', value: 'dashed' },
  { label: 'Titik', value: 'dotted' },
  { label: 'Ganda', value: 'double' },
];

export const BORDER_STYLE_VALUES = BORDER_STYLES.map((item) => item.value);

export const RADIUS_PRESETS = [
  { label: '0', value: 0 },
  { label: '4', value: 4 },
  { label: '6', value: 6 },
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: 'Penuh', value: 999 },
];

export const BUTTON_VARIANTS = [
  { label: 'Isi', value: 'fill' },
  { label: 'Garis', value: 'outline' },
  { label: 'Teks', value: 'ghost' },
];

export const SHADOW_OPTIONS = [
  { label: 'Tidak ada', value: 'none' },
  { label: 'Tipis', value: 'sm' },
  { label: 'Sedang', value: 'md' },
  { label: 'Tebal', value: 'lg' },
];

export const SHADOW_VALUES = SHADOW_OPTIONS.map((item) => item.value);

export const SHADOW_CSS = {
  none: '',
  sm: '0 1px 2px rgb(15 23 42 / 0.08)',
  md: '0 4px 14px rgb(15 23 42 / 0.1)',
  lg: '0 12px 28px rgb(15 23 42 / 0.14)',
};

export function emptySides(unit = 'px') {
  return { top: '', right: '', bottom: '', left: '', unit };
}

export function emptyMeasure(unit = 'px') {
  return { value: '', unit };
}

export function sidesOf(top, right = top, bottom = top, left = right, unit = 'px') {
  return { top, right, bottom, left, unit };
}

export function measureOf(value, unit = 'px') {
  return { value, unit };
}

function isBlank(value) {
  return value === '' || value == null;
}

function fillSides(sides, fallback) {
  if (!sides || typeof sides !== 'object') return fallback;
  return {
    top: isBlank(sides.top) ? fallback.top : sides.top,
    right: isBlank(sides.right) ? fallback.right : sides.right,
    bottom: isBlank(sides.bottom) ? fallback.bottom : sides.bottom,
    left: isBlank(sides.left) ? fallback.left : sides.left,
    unit: sides.unit || fallback.unit,
  };
}

function fillMeasure(measure, fallback) {
  if (!measure || typeof measure !== 'object') return fallback;
  if (measure.unit === 'auto') return { value: '', unit: 'auto' };
  if (isBlank(measure.value)) return fallback;
  return { value: measure.value, unit: measure.unit || fallback.unit };
}

export const DEFAULT_PADDING = sidesOf(16);
export const DEFAULT_MARGIN = sidesOf(0);
export const DEFAULT_WIDTH = measureOf(100, '%');
export const DEFAULT_HEIGHT = measureOf('', 'auto');
export const SECTION_PADDING = sidesOf(56, 24, 56, 24);
export const CARD_PADDING = sidesOf(24);
export const BAND_PADDING = sidesOf(24, 24, 24, 24);
export const BUTTON_PADDING = sidesOf(10, 20, 10, 20);
export const DEFAULT_BORDER = { width: 0, style: 'none', color: '', radius: 0 };
export const CARD_BORDER = { width: 1, style: 'solid', color: 'neutral-200', radius: 6 };
export const BUTTON_BORDER = { width: 1, style: 'solid', color: 'primary', radius: 6 };

export function emptyBox(overrides = {}) {
  return {
    backgroundColor: '',
    color: '',
    padding: emptySides(),
    margin: emptySides(),
    width: emptyMeasure(),
    height: emptyMeasure(),
    position: 'static',
    offset: emptySides(),
    zIndex: 0,
    keepPositionOnMobile: false,
    fontFamily: '',
    borderWidth: '',
    borderStyle: 'none',
    borderColor: '',
    borderRadius: '',
    opacity: 100,
    shadow: 'none',
    placeX: 'stretch',
    placeY: 'top',
    rotate: 0,
    flipX: false,
    flipY: false,
    ...overrides,
  };
}

/** Nilai awal field gaya — angka terlihat, bukan input kosong. */
export function defaultBox(overrides = {}) {
  return emptyBox({
    padding: DEFAULT_PADDING,
    margin: DEFAULT_MARGIN,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    borderWidth: DEFAULT_BORDER.width,
    borderStyle: DEFAULT_BORDER.style,
    borderColor: DEFAULT_BORDER.color,
    borderRadius: DEFAULT_BORDER.radius,
    opacity: 100,
    shadow: 'none',
    placeX: 'stretch',
    placeY: 'top',
    rotate: 0,
    flipX: false,
    flipY: false,
    ...overrides,
  });
}

export function fillBox(box, extras = {}) {
  const base = defaultBox(extras);
  if (!box || typeof box !== 'object' || Array.isArray(box)) return base;
  return {
    ...base,
    ...box,
    padding: fillSides(box.padding, base.padding),
    margin: fillSides(box.margin, base.margin),
    width: fillMeasure(box.width, base.width),
    height: fillMeasure(box.height, base.height),
    offset: box.offset && typeof box.offset === 'object' ? { ...emptySides(), ...box.offset } : base.offset,
    borderWidth: isBlank(box.borderWidth) ? base.borderWidth : box.borderWidth,
    borderStyle: box.borderStyle || base.borderStyle,
    borderColor: isBlank(box.borderColor) ? base.borderColor : box.borderColor,
    borderRadius: isBlank(box.borderRadius) ? base.borderRadius : box.borderRadius,
    opacity: isBlank(box.opacity) ? base.opacity : box.opacity,
    shadow: box.shadow || base.shadow,
    placeX: box.placeX || base.placeX,
    placeY: box.placeY || base.placeY,
    rotate: isBlank(box.rotate) ? base.rotate : box.rotate,
    flipX: box.flipX === true,
    flipY: box.flipY === true,
  };
}
