import { FONT_SCALES, getFontScale, isDarkAdminTheme } from '../constants/theme';

export function applyAccessibilityToDocument(theme, fontScale) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const scale = getFontScale(fontScale);
  root.style.fontSize = `${scale.px}px`;
  const dark = isDarkAdminTheme(theme);
  root.dataset.themeMode = dark ? 'dark' : 'light';
  root.style.colorScheme = dark ? 'dark' : 'light';
}

export function fontScaleIndex(fontScale) {
  const current = getFontScale(fontScale);
  return FONT_SCALES.findIndex((item) => item.id === current.id);
}
