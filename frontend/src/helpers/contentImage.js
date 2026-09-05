export const IMAGE_SIZE_OPTIONS = [
  { label: 'Kecil', value: 'sm' },
  { label: 'Sedang', value: 'md' },
  { label: 'Besar', value: 'lg' },
  { label: 'Penuh', value: 'full' },
];

export const IMAGE_ALIGN_OPTIONS = [
  { label: 'Kiri', value: 'left' },
  { label: 'Tengah', value: 'center' },
  { label: 'Kanan', value: 'right' },
];

const SIZES = IMAGE_SIZE_OPTIONS.map((item) => item.value);
const ALIGNS = IMAGE_ALIGN_OPTIONS.map((item) => item.value);

export const PUCK_IMAGE_SIZE = {
  sm: 'max-w-xs',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  full: 'max-w-7xl',
};

export const PUCK_IMAGE_ALIGN = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

export function imageClass({ size = 'md', align = 'center' } = {}) {
  const safeSize = SIZES.includes(size) ? size : 'md';
  const safeAlign = ALIGNS.includes(align) ? align : 'center';
  return `content-img content-img-${safeSize} content-img-${safeAlign}`;
}

export function parseImageClass(className = '') {
  const tokens = String(className).split(/\s+/);
  return {
    size: SIZES.find((value) => tokens.includes(`content-img-${value}`)) || 'md',
    align: ALIGNS.find((value) => tokens.includes(`content-img-${value}`)) || 'center',
  };
}
