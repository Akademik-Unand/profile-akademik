import { FONT_SCALES, getFontScale } from '../constants/theme';
import { applyAccessibilityToDocument, fontScaleIndex } from './accessibility';

describe('applyAccessibilityToDocument', () => {
  afterEach(() => {
    document.documentElement.style.fontSize = '';
    delete document.documentElement.dataset.themeMode;
    document.documentElement.style.colorScheme = '';
  });

  it('writes the font scale onto html so rem-based UI actually changes', () => {
    applyAccessibilityToDocument('admin', 'xxlarge');
    expect(document.documentElement.style.fontSize).toBe(`${FONT_SCALES[3].px}px`);
    expect(document.documentElement.dataset.themeMode).toBe('light');
  });

  it('marks dark mode on the document', () => {
    applyAccessibilityToDocument('admin-dark', 'normal');
    expect(document.documentElement.dataset.themeMode).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});

describe('fontScaleIndex', () => {
  it('finds the current scale', () => {
    expect(fontScaleIndex('large')).toBe(1);
    expect(getFontScale('missing').id).toBe('normal');
  });
});
