import { DEFAULT_MOTION, MOTION_EFFECT_VALUES } from '../constants/blockMotion';

function clamp(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function sanitizeMotion(motion) {
  if (!motion || typeof motion !== 'object' || Array.isArray(motion)) {
    return { ...DEFAULT_MOTION };
  }
  return {
    effect: MOTION_EFFECT_VALUES.includes(motion.effect) ? motion.effect : DEFAULT_MOTION.effect,
    delay: clamp(motion.delay, 0, 800, DEFAULT_MOTION.delay),
    duration: clamp(motion.duration, 400, 1200, DEFAULT_MOTION.duration),
    once: motion.once !== false && motion.once !== 'false',
  };
}

export function motionRevision(document) {
  const items = Array.isArray(document?.content) ? document.content : [];
  return items.map((item) => item?.props?.id || item?.type || '').join('|');
}

export function motionAttrs(motion) {
  const clean = sanitizeMotion(motion);
  if (clean.effect === 'none') return {};
  return {
    'data-aos': clean.effect,
    'data-aos-delay': String(clean.delay),
    'data-aos-duration': String(clean.duration),
    'data-aos-once': clean.once ? 'true' : 'false',
  };
}
