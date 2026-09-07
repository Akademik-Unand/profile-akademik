import {
  BORDER_STYLE_VALUES,
  BACKGROUND_POSITION_VALUES,
  BACKGROUND_SIZE_VALUES,
  FONT_VALUES,
  OVERLAY_DIRECTION_VALUES,
  OVERLAY_MODE_VALUES,
  SHADOW_CSS,
  SHADOW_VALUES,
  PLACE_X_VALUES,
  PLACE_Y_VALUES,
  LAYOUT_POSITIONS,
  HEIGHT_UNITS,
  LAYOUT_UNITS,
  PALETTE_HEX,
  WIDTH_UNITS,
  emptyBox,
  emptyMeasure,
  emptySides,
} from '../constants/layoutBox';
import { resolveMediaSrc } from './mediaUrl';

const POSITIONS = LAYOUT_POSITIONS.map((item) => item.value);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampForUnit(n, unit, { min, max, percentMax = 100 }) {
  if (unit === '%' || unit === 'vh' || unit === 'vw') return clamp(n, Math.max(min, -percentMax), percentMax);
  return clamp(n, min, max);
}

export function resolveColor(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (PALETTE_HEX[trimmed]) return PALETTE_HEX[trimmed];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;
  return '';
}

export function sanitizeImageUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim().slice(0, 2048);
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/uploads/')) return trimmed;
  return '';
}

export function sanitizeBackgroundImage(image) {
  if (!image || typeof image !== 'object' || Array.isArray(image)) return null;
  const url = sanitizeImageUrl(image.url);
  if (!url) return null;
  const mediaId = Number(image.mediaId);
  return { mediaId: Number.isFinite(mediaId) && mediaId > 0 ? mediaId : null, url };
}

function hexToRgba(hex, alpha) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(15, 23, 42, ${alpha})`;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildOverlayLayer(box) {
  if (!box?.overlayEnabled) return '';
  const opacity = Math.min(0.9, Math.max(0, Number(box.overlayOpacity ?? 45) / 100));
  const from = resolveColor(box.overlayColor) || '#0e3b2e';
  if (box.overlayMode === 'gradient') {
    const toHex = resolveColor(box.overlayGradientTo) || 'transparent';
    const to = toHex === 'transparent' ? `rgba(0,0,0,0)` : hexToRgba(toHex, opacity);
    const dir = OVERLAY_DIRECTION_VALUES.includes(box.overlayDirection) ? box.overlayDirection : 'to bottom';
    return `linear-gradient(${dir}, ${hexToRgba(from, opacity)}, ${to})`;
  }
  const solid = hexToRgba(from, opacity);
  return `linear-gradient(${solid}, ${solid})`;
}

export function sanitizeNumber(value, min, max, unit = 'px') {
  if (value === '' || value == null) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return clampForUnit(n, unit, { min, max });
}

export function sanitizeUnit(unit, allowed = LAYOUT_UNITS) {
  return allowed.includes(unit) ? unit : 'px';
}

export function sanitizeSides(sides, min, max) {
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

export function sanitizeMeasure(measure, min, max, allowAuto = false, allowedUnits) {
  if (!measure || typeof measure !== 'object') return emptyMeasure();
  const allowed = allowedUnits || (allowAuto ? WIDTH_UNITS : LAYOUT_UNITS);
  const unit = sanitizeUnit(measure.unit, allowed);
  if (allowAuto && unit === 'auto') return { value: '', unit: 'auto' };
  return { value: sanitizeNumber(measure.value, min, max, unit), unit };
}

export function sanitizeBox(box) {
  if (!box || typeof box !== 'object' || Array.isArray(box)) return emptyBox();
  return {
    backgroundColor: resolveColor(box.backgroundColor) ? String(box.backgroundColor).trim() : '',
    color: resolveColor(box.color) ? String(box.color).trim() : '',
    backgroundImage: sanitizeBackgroundImage(box.backgroundImage),
    backgroundSize: BACKGROUND_SIZE_VALUES.includes(box.backgroundSize) ? box.backgroundSize : 'cover',
    backgroundPosition: BACKGROUND_POSITION_VALUES.includes(box.backgroundPosition) ? box.backgroundPosition : 'center',
    overlayEnabled: box.overlayEnabled === true,
    overlayMode: OVERLAY_MODE_VALUES.includes(box.overlayMode) ? box.overlayMode : 'solid',
    overlayColor: resolveColor(box.overlayColor) ? String(box.overlayColor).trim() : 'hero',
    overlayGradientTo: resolveColor(box.overlayGradientTo) ? String(box.overlayGradientTo).trim() : '',
    overlayDirection: OVERLAY_DIRECTION_VALUES.includes(box.overlayDirection) ? box.overlayDirection : 'to bottom',
    overlayOpacity: sanitizeNumber(box.overlayOpacity, 0, 90) === '' ? 45 : sanitizeNumber(box.overlayOpacity, 0, 90),
    padding: sanitizeSides(box.padding, 0, 240),
    margin: sanitizeSides(box.margin, -240, 240),
    width: sanitizeMeasure(box.width, 0, 2400, true),
    height: sanitizeMeasure(box.height, 0, 2400, true, HEIGHT_UNITS),
    position: POSITIONS.includes(box.position) ? box.position : 'static',
    offset: sanitizeSides(box.offset, -240, 240),
    zIndex: sanitizeNumber(box.zIndex, 0, 50) || 0,
    keepPositionOnMobile: box.keepPositionOnMobile === true,
    fontFamily: FONT_VALUES.includes(box.fontFamily) ? box.fontFamily : '',
    borderWidth: sanitizeNumber(box.borderWidth, 0, 16),
    borderStyle: BORDER_STYLE_VALUES.includes(box.borderStyle) ? box.borderStyle : 'none',
    borderColor: resolveColor(box.borderColor) ? String(box.borderColor).trim() : '',
    borderRadius: sanitizeNumber(box.borderRadius, 0, 999),
    opacity: sanitizeNumber(box.opacity, 0, 100) === '' ? 100 : sanitizeNumber(box.opacity, 0, 100),
    shadow: SHADOW_VALUES.includes(box.shadow) ? box.shadow : 'none',
    placeX: PLACE_X_VALUES.includes(box.placeX) ? box.placeX : 'stretch',
    placeY: PLACE_Y_VALUES.includes(box.placeY) ? box.placeY : 'top',
    rotate: sanitizeNumber(box.rotate, -360, 360) === '' ? 0 : sanitizeNumber(box.rotate, -360, 360),
    flipX: box.flipX === true,
    flipY: box.flipY === true,
  };
}

function cssMeasure(value, unit) {
  if (unit === 'auto') return 'auto';
  if (value === '' || value == null || !Number.isFinite(Number(value))) return '';
  return `${Number(value)}${unit}`;
}

function applySides(style, prefix, sides) {
  ['top', 'right', 'bottom', 'left'].forEach((side) => {
    const css = cssMeasure(sides[side], sides.unit);
    if (css) style[`${prefix}${side[0].toUpperCase()}${side.slice(1)}`] = css;
  });
}

export function hasBoxSides(sides) {
  return ['top', 'right', 'bottom', 'left'].some((side) => sides?.[side] !== '' && sides?.[side] != null);
}

export function hasMeasure(measure) {
  return measure?.unit === 'auto' || (measure?.value !== '' && measure?.value != null);
}

export function measureToCss(measure) {
  return boxToStyle({ width: measure }).width || '';
}

export function boxToStyle(box = {}, { defaultPosition, containFixed } = {}) {
  const clean = sanitizeBox(box);
  const style = {};
  const backgroundColor = resolveColor(clean.backgroundColor);
  const color = resolveColor(clean.color);
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (color) style.color = color;

  const layers = [];
  const overlay = buildOverlayLayer(clean);
  if (overlay) layers.push(overlay);
  const imageUrl = sanitizeImageUrl(clean.backgroundImage?.url);
  if (imageUrl) {
    const safe = resolveMediaSrc(imageUrl).replace(/"/g, '');
    layers.push(`url("${safe}")`);
    style.backgroundSize = clean.backgroundSize || 'cover';
    style.backgroundPosition = clean.backgroundPosition || 'center';
    style.backgroundRepeat = 'no-repeat';
  }
  if (layers.length) style.backgroundImage = layers.join(', ');

  applySides(style, 'padding', clean.padding);
  applySides(style, 'margin', clean.margin);

  const width = cssMeasure(clean.width.value, clean.width.unit);
  if (width && width !== 'auto') style.width = width;

  const height = cssMeasure(clean.height.value, clean.height.unit);
  if (height && height !== 'auto' && Number(clean.height.value) !== 0) style.height = height;

  let position = clean.position !== 'static' ? clean.position : defaultPosition || 'static';
  if (containFixed && position === 'fixed') position = 'absolute';
  if (position && position !== 'static') style.position = position;

  if (position === 'absolute' || position === 'fixed' || position === 'relative' || position === 'sticky') {
    ['top', 'right', 'bottom', 'left'].forEach((side) => {
      const css = cssMeasure(clean.offset[side], clean.offset.unit);
      if (css) style[side] = css;
    });
  }

  if (clean.zIndex) style.zIndex = clean.zIndex;
  if (clean.fontFamily) style.fontFamily = clean.fontFamily;

  if (clean.borderStyle && clean.borderStyle !== 'none') {
    style.borderStyle = clean.borderStyle;
    if (clean.borderWidth !== '' && clean.borderWidth != null) style.borderWidth = `${clean.borderWidth}px`;
    const borderColor = resolveColor(clean.borderColor);
    if (borderColor) style.borderColor = borderColor;
  } else if (clean.borderStyle === 'none') {
    style.borderStyle = 'none';
  }
  if (clean.borderRadius !== '' && clean.borderRadius != null) style.borderRadius = `${clean.borderRadius}px`;
  if (clean.opacity !== '' && clean.opacity != null && Number(clean.opacity) !== 100) {
    style.opacity = Number(clean.opacity) / 100;
  }
  if (clean.shadow && SHADOW_CSS[clean.shadow]) style.boxShadow = SHADOW_CSS[clean.shadow];

  const transforms = [];
  if (Number(clean.rotate)) transforms.push(`rotate(${clean.rotate}deg)`);
  if (clean.flipX) transforms.push('scaleX(-1)');
  if (clean.flipY) transforms.push('scaleY(-1)');
  if (transforms.length) style.transform = transforms.join(' ');

  return style;
}

export function boxToMobileClass(box) {
  const position = box?.position;
  if ((position === 'absolute' || position === 'fixed') && !box?.keepPositionOnMobile) {
    return 'box-static-mobile';
  }
  return '';
}

export function editorBoxStyle(box, puck, extras = {}) {
  return boxToStyle(box, { ...extras, containFixed: puck?.isEditing === true });
}

export function boxToPlaceClass(box) {
  const x = PLACE_X_VALUES.includes(box?.placeX) ? box.placeX : 'stretch';
  const y = PLACE_Y_VALUES.includes(box?.placeY) ? box.placeY : 'top';
  const across = {
    stretch: '',
    left: 'self-start w-max max-w-full',
    center: 'self-center w-max max-w-full',
    right: 'self-end w-max max-w-full',
  };
  const down = {
    top: '',
    middle: 'my-auto',
    bottom: 'mt-auto',
  };
  return [across[x], down[y]].filter(Boolean).join(' ');
}
