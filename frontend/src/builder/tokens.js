export const BG_CLASS = {
  base: 'bg-base text-neutral-900',
  surface: 'bg-surface text-neutral-900',
  mist: 'bg-mist text-neutral-900',
  hero: 'bg-hero text-white',
  primary: 'bg-primary text-white',
};

export const PAD_CLASS = {
  none: 'py-0',
  sm: 'py-8',
  md: 'py-14',
  lg: 'py-20',
  xl: 'py-28 md:py-32',
};

export const MARGIN_CLASS = {
  none: '',
  sm: 'my-4',
  md: 'my-8',
  lg: 'my-12',
};

export const WIDTH_CLASS = {
  full: 'max-w-none px-0',
  wide: 'mx-auto max-w-7xl px-4 md:px-6',
  content: 'mx-auto max-w-5xl px-4 md:px-6',
  narrow: 'mx-auto max-w-3xl px-4 md:px-6',
};

export const TITLE_CLASS = {
  md: 'font-headline text-2xl md:text-3xl',
  lg: 'font-headline text-3xl md:text-4xl',
  xl: 'font-headline text-3xl md:text-5xl',
  '5xl': 'font-headline text-4xl leading-tight md:text-5xl',
};

export const ALIGN_CLASS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const ALIGN_PLACE_CLASS = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
  justify: 'mx-auto',
};

export const ALIGN_FLEX_CLASS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  justify: 'justify-center',
};

export function sectionClass(background = 'base', padding = 'md', margin = 'none') {
  return `${BG_CLASS[background] || BG_CLASS.base} ${PAD_CLASS[padding] || PAD_CLASS.md} ${MARGIN_CLASS[margin] || ''}`.trim();
}

export function isCustomColor(value) {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}
