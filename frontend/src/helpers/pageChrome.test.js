import { pageChromePreview } from './pageChrome';

describe('pageChromePreview', () => {
  it('shows hero and sidebar for the article shell', () => {
    expect(pageChromePreview({ chrome: 'shell', sidebar: 'auto', showHero: true })).toEqual({
      showHeroBar: true,
      showSidebar: true,
    });
  });

  it('hides chrome on a full-width canvas unless forced', () => {
    expect(pageChromePreview({ chrome: 'full', sidebar: 'auto', showHero: false })).toEqual({
      showHeroBar: false,
      showSidebar: false,
    });
    expect(pageChromePreview({ chrome: 'full', sidebar: 'show', showHero: true }).showSidebar).toBe(true);
  });
});
