export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const AOS_CONFIG = {
  duration: 700,
  easing: 'ease-out-cubic',
  offset: 72,
  once: true,
  disable: prefersReducedMotion,
};
