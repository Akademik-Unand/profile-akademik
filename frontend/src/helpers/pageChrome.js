/**
 * Pratinjau kerangka halaman di kanvas editor.
 */
export function pageChromePreview({ chrome, sidebar, showHero } = {}) {
  const full = chrome === 'full';
  return {
    showHeroBar: showHero !== false && showHero !== 'false',
    showSidebar: sidebar === 'show' || (sidebar === 'auto' && !full),
  };
}
