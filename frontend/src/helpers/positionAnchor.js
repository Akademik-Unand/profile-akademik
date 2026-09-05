import { emptySides } from '../constants/layoutBox';

export function inferAnchor(offset = {}) {
  const has = (side) => offset[side] !== '' && offset[side] != null;
  const top = has('top');
  const bottom = has('bottom');
  const left = has('left');
  const right = has('right');
  if (top && right && !bottom && !left) return 'tr';
  if (bottom && right && !top && !left) return 'br';
  if (bottom && left && !top && !right) return 'bl';
  if (bottom && !left && !right) return 'bc';
  if (right && !top && !bottom) return 'mr';
  if (left && !top && !bottom && !right) return 'ml';
  if (top && !left && !right && !bottom) return 'tc';
  if (top && left) return 'tl';
  if (!top && !bottom && !left && !right) return 'tl';
  return 'tl';
}

export function readAnchorXY(offset = {}) {
  const anchor = inferAnchor(offset);
  const x = ['tr', 'mr', 'br'].includes(anchor) ? offset.right : offset.left;
  const y = ['bl', 'bc', 'br'].includes(anchor) ? offset.bottom : offset.top;
  return { anchor, x: x ?? '', y: y ?? '', unit: offset.unit || 'px' };
}

export function applyAnchor(anchor, x, y, unit = 'px') {
  const next = { ...emptySides(unit), unit };
  if (['tr', 'mr', 'br'].includes(anchor)) next.right = x;
  else next.left = x;
  if (['bl', 'bc', 'br'].includes(anchor)) next.bottom = y;
  else next.top = y;
  return next;
}
