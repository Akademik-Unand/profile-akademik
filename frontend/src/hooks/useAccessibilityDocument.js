import { useEffect } from 'react';
import { applyAccessibilityToDocument } from '../helpers/accessibility';
import { useUiStore } from '../store/ui.store';

export function useAccessibilityDocument() {
  const theme = useUiStore((state) => state.theme);
  const fontScale = useUiStore((state) => state.fontScale);

  useEffect(() => {
    applyAccessibilityToDocument(theme, fontScale);
  }, [theme, fontScale]);
}
