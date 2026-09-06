export const MOTION_EFFECTS = [
  { label: 'Tidak ada', value: 'none' },
  { label: 'Pudar', value: 'fade' },
  { label: 'Pudar dari bawah', value: 'fade-up' },
  { label: 'Pudar dari atas', value: 'fade-down' },
  { label: 'Pudar dari kiri', value: 'fade-left' },
  { label: 'Pudar dari kanan', value: 'fade-right' },
  { label: 'Perbesar', value: 'zoom-in' },
  { label: 'Perkecil', value: 'zoom-out' },
  { label: 'Balik ke atas', value: 'flip-up' },
];

export const MOTION_EFFECT_VALUES = MOTION_EFFECTS.map((item) => item.value);

export const DEFAULT_MOTION = {
  effect: 'none',
  delay: 0,
  duration: 700,
  once: true,
};

export function defaultMotion(overrides = {}) {
  return { ...DEFAULT_MOTION, ...overrides };
}
