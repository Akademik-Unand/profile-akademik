/** Palet grafik mengikuti tema MyUNAND. */
export const CHART_COLORS = {
  light: {
    primary: '#15803d',
    secondary: '#0284c7',
    accent: '#d97706',
    success: '#16a34a',
    muted: '#94a3b8',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#22c55e',
    secondary: '#38bdf8',
    accent: '#fbbf24',
    success: '#4ade80',
    muted: '#64748b',
    warning: '#fbbf24',
    error: '#f87171',
  },
};

export const FONT_SCALES = [
  { id: 'normal', label: 'Normal', px: 16 },
  { id: 'large', label: 'Besar', px: 18 },
  { id: 'xlarge', label: 'Lebih besar', px: 20 },
  { id: 'xxlarge', label: 'Sangat besar', px: 24 },
];

export const DEFAULT_FONT_SCALE = 'normal';
export const DEFAULT_ADMIN_THEME = 'admin';
export const DARK_ADMIN_THEME = 'admin-dark';

export function getFontScale(id) {
  return FONT_SCALES.find((item) => item.id === id) || FONT_SCALES[0];
}

export function isDarkAdminTheme(id) {
  return id === DARK_ADMIN_THEME;
}

export function getChartColors(theme) {
  return isDarkAdminTheme(theme) ? CHART_COLORS.dark : CHART_COLORS.light;
}
