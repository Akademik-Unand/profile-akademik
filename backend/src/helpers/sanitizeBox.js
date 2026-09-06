const UNITS = ['px', 'rem', '%', 'vh', 'vw', 'em'];
const WIDTH_UNITS = ['px', 'rem', '%', 'auto'];
const HEIGHT_UNITS = [...UNITS, 'auto'];
const POSITIONS = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
const FONTS = [
  'Inter, sans-serif',
  'Manrope, sans-serif',
  'Georgia, serif',
  '"Times New Roman", Times, serif',
  'Arial, Helvetica, sans-serif',
];
const BORDER_STYLES = ['none', 'solid', 'dashed', 'dotted', 'double'];
const SHADOWS = ['none', 'sm', 'md', 'lg'];
const PLACE_X = ['stretch', 'left', 'center', 'right'];
const PLACE_Y = ['top', 'middle', 'bottom'];
const PALETTE = [
  'primary',
  'primary-hover',
  'secondary',
  'base',
  'surface',
  'mist',
  'hero',
  'hero-footer',
  'neutral-200',
  'neutral-500',
  'neutral-900',
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampForUnit(n, unit, min, max) {
  if (unit === '%' || unit === 'vh' || unit === 'vw') return clamp(n, Math.max(min, -100), 100);
  return clamp(n, min, max);
}

function sanitizeNumber(value, min, max, unit = 'px') {
  if (value === '' || value == null) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return clampForUnit(n, unit, min, max);
}

function sanitizeUnit(unit, allowed = UNITS) {
  return allowed.includes(unit) ? unit : 'px';
}

function sanitizeColor(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (PALETTE.includes(trimmed)) return trimmed;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
  return '';
}

function emptySides() {
  return { top: '', right: '', bottom: '', left: '', unit: 'px' };
}

function sanitizeSides(sides, min, max) {
  if (!sides || typeof sides !== 'object') return emptySides();
  const unit = sanitizeUnit(sides.unit);
  return {
    top: sanitizeNumber(sides.top, min, max, unit),
    right: sanitizeNumber(sides.right, min, max, unit),
    bottom: sanitizeNumber(sides.bottom, min, max, unit),
    left: sanitizeNumber(sides.left, min, max, unit),
    unit,
  };
}

function sanitizeMeasure(measure, min, max, allowAuto = false, allowedUnits) {
  if (!measure || typeof measure !== 'object') return { value: '', unit: 'px' };
  const allowed = allowedUnits || (allowAuto ? WIDTH_UNITS : UNITS);
  const unit = sanitizeUnit(measure.unit, allowed);
  if (allowAuto && unit === 'auto') return { value: '', unit: 'auto' };
  return { value: sanitizeNumber(measure.value, min, max, unit), unit };
}

const DISPLAY_LAYOUTS = ['list', 'cards'];
const DISPLAY_BOOLS = ['title', 'date', 'time', 'location', 'description', 'category', 'excerpt', 'cover'];

function sanitizeDisplay(display) {
  if (!display || typeof display !== 'object' || Array.isArray(display)) return undefined;
  const next = {
    layout: DISPLAY_LAYOUTS.includes(display.layout) ? display.layout : 'list',
  };
  DISPLAY_BOOLS.forEach((key) => {
    if (display[key] === undefined) return;
    next[key] = display[key] !== false && display[key] !== 'false';
  });
  return next;
}

function sanitizeBox(box) {
  if (!box || typeof box !== 'object' || Array.isArray(box)) return undefined;
  return {
    backgroundColor: sanitizeColor(box.backgroundColor),
    color: sanitizeColor(box.color),
    padding: sanitizeSides(box.padding, 0, 240),
    margin: sanitizeSides(box.margin, -240, 240),
    width: sanitizeMeasure(box.width, 0, 2400, true),
    height: sanitizeMeasure(box.height, 0, 2400, true, HEIGHT_UNITS),
    position: POSITIONS.includes(box.position) ? box.position : 'static',
    offset: sanitizeSides(box.offset, -240, 240),
    zIndex: sanitizeNumber(box.zIndex, 0, 50) || 0,
    keepPositionOnMobile: box.keepPositionOnMobile === true,
    fontFamily: FONTS.includes(box.fontFamily) ? box.fontFamily : '',
    borderWidth: sanitizeNumber(box.borderWidth, 0, 16, 'px'),
    borderStyle: BORDER_STYLES.includes(box.borderStyle) ? box.borderStyle : 'none',
    borderColor: sanitizeColor(box.borderColor),
    borderRadius: sanitizeNumber(box.borderRadius, 0, 999, 'px'),
    opacity: sanitizeNumber(box.opacity, 0, 100, 'px') === '' ? 100 : sanitizeNumber(box.opacity, 0, 100, 'px'),
    shadow: SHADOWS.includes(box.shadow) ? box.shadow : 'none',
    placeX: PLACE_X.includes(box.placeX) ? box.placeX : 'stretch',
    placeY: PLACE_Y.includes(box.placeY) ? box.placeY : 'top',
    rotate: sanitizeNumber(box.rotate, -360, 360, 'px') === '' ? 0 : sanitizeNumber(box.rotate, -360, 360, 'px'),
    flipX: box.flipX === true,
    flipY: box.flipY === true,
  };
}

const MOTION_EFFECTS = [
  'none',
  'fade',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-right',
  'zoom-in',
  'zoom-out',
  'flip-up',
];

function sanitizeMotion(motion) {
  const fallback = { effect: 'none', delay: 0, duration: 700, once: true };
  if (!motion || typeof motion !== 'object' || Array.isArray(motion)) return fallback;
  const delay = sanitizeNumber(motion.delay, 0, 800, 'px');
  const duration = sanitizeNumber(motion.duration, 400, 1200, 'px');
  return {
    effect: MOTION_EFFECTS.includes(motion.effect) ? motion.effect : fallback.effect,
    delay: delay === '' ? fallback.delay : delay,
    duration: duration === '' ? fallback.duration : duration,
    once: motion.once !== false && motion.once !== 'false',
  };
}

module.exports = { sanitizeBox, sanitizeDisplay, sanitizeMotion };
