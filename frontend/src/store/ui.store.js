import { create } from 'zustand';
import {
  DARK_ADMIN_THEME,
  DEFAULT_ADMIN_THEME,
  DEFAULT_FONT_SCALE,
  FONT_SCALES,
  getFontScale,
} from '../constants/theme';

const THEME_KEY = 'pa_admin_theme';
const FONT_KEY = 'pa_admin_font_scale';

function readTheme() {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_THEME;
  const stored = localStorage.getItem(THEME_KEY);
  return stored === DARK_ADMIN_THEME ? DARK_ADMIN_THEME : DEFAULT_ADMIN_THEME;
}

function readFontScale() {
  if (typeof window === 'undefined') return DEFAULT_FONT_SCALE;
  const stored = localStorage.getItem(FONT_KEY);
  return FONT_SCALES.some((item) => item.id === stored) ? stored : DEFAULT_FONT_SCALE;
}

export const useUiStore = create((set, get) => ({
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  theme: readTheme(),
  fontScale: readFontScale(),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),

  setTheme: (theme) => {
    const next = theme === DARK_ADMIN_THEME ? DARK_ADMIN_THEME : DEFAULT_ADMIN_THEME;
    if (typeof window !== 'undefined') localStorage.setItem(THEME_KEY, next);
    set({ theme: next });
  },

  toggleTheme: () => {
    const next = get().theme === DARK_ADMIN_THEME ? DEFAULT_ADMIN_THEME : DARK_ADMIN_THEME;
    get().setTheme(next);
  },

  setFontScale: (id) => {
    const fontScale = getFontScale(id).id;
    if (typeof window !== 'undefined') localStorage.setItem(FONT_KEY, fontScale);
    set({ fontScale });
  },

  stepFontScale: (direction) => {
    const index = FONT_SCALES.findIndex((item) => item.id === get().fontScale);
    const next = FONT_SCALES[index + direction];
    if (next) get().setFontScale(next.id);
  },
}));

