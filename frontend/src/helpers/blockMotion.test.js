import { motionAttrs, motionRevision, sanitizeMotion } from './blockMotion';

describe('sanitizeMotion', () => {
  it('returns the default when the value is missing or unsafe', () => {
    expect(sanitizeMotion(null)).toEqual({ effect: 'none', delay: 0, duration: 700, once: true });
    expect(sanitizeMotion('fade-up; url(x)')).toEqual({ effect: 'none', delay: 0, duration: 700, once: true });
  });

  it('keeps a safe motion and drops injection', () => {
    expect(
      sanitizeMotion({
        effect: 'fade-up',
        delay: 120,
        duration: 800,
        once: false,
      }),
    ).toEqual({ effect: 'fade-up', delay: 120, duration: 800, once: false });
    expect(
      sanitizeMotion({
        effect: 'fade-up; url(x)',
        delay: 99999,
        duration: 10,
        once: 'false',
      }),
    ).toEqual({ effect: 'none', delay: 800, duration: 400, once: false });
  });
});

describe('motionRevision', () => {
  it('joins block ids so AOS can refresh after content changes', () => {
    expect(motionRevision({ content: [{ type: 'Heading', props: { id: 'h-1' } }] })).toBe('h-1');
    expect(motionRevision(null)).toBe('');
  });
});

describe('motionAttrs', () => {
  it('omits attributes when the effect is none', () => {
    expect(motionAttrs({ effect: 'none', delay: 100, duration: 700, once: true })).toEqual({});
  });

  it('maps a valid effect to AOS data attributes', () => {
    expect(motionAttrs({ effect: 'zoom-in', delay: 80, duration: 600, once: true })).toEqual({
      'data-aos': 'zoom-in',
      'data-aos-delay': '80',
      'data-aos-duration': '600',
      'data-aos-once': 'true',
    });
  });
});
