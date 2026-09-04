import { AOS_CONFIG, prefersReducedMotion } from './motion';

describe('prefersReducedMotion', () => {
  const original = window.matchMedia;

  afterEach(() => {
    window.matchMedia = original;
  });

  it('is false when the user has no motion preference', () => {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    });
    expect(prefersReducedMotion()).toBe(false);
  });

  it('is true when the user prefers reduced motion', () => {
    window.matchMedia = (query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    });
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe('AOS_CONFIG', () => {
  it('uses a short ease-out fade and plays once', () => {
    expect(AOS_CONFIG.duration).toBe(700);
    expect(AOS_CONFIG.easing).toBe('ease-out-cubic');
    expect(AOS_CONFIG.once).toBe(true);
    expect(AOS_CONFIG.disable).toBe(prefersReducedMotion);
  });
});
