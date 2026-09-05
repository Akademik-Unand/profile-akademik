import { extractLandingLegacy } from './landingFromBuilder';

describe('extractLandingLegacy', () => {
  it('maps hero and services blocks back to landing fields', () => {
    const legacy = extractLandingLegacy({
      content: [
        { type: 'Hero', props: { title: 'Portal', ctaLabel: 'Masuk', slides: [] } },
        { type: 'Services', props: { items: [{ label: 'SIMA', url: 'https://sima.unand.ac.id' }] } },
        { type: 'ClosingCta', props: { title: 'Akses', body: 'Silakan' } },
      ],
    });
    expect(legacy.heroTitle).toBe('Portal');
    expect(legacy.showServices).toBe(true);
    expect(legacy.showNews).toBe(false);
    expect(legacy.services[0].label).toBe('SIMA');
    expect(legacy.contactTitle).toBe('Akses');
  });
});
