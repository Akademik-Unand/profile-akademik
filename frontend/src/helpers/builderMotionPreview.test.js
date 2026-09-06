import { playBuilderMotion } from './builderMotionPreview';

describe('playBuilderMotion', () => {
  it('adds a one-shot play class on matching canvas nodes', () => {
    document.body.innerHTML = `
      <div class="builder-canvas">
        <section data-aos="fade-up"></section>
      </div>
    `;
    playBuilderMotion('fade-up', 400);
    const node = document.querySelector('[data-aos="fade-up"]');
    expect(node.classList.contains('builder-motion-play')).toBe(true);
    expect(node.getAttribute('data-builder-motion')).toBe('fade-up');
    document.body.innerHTML = '';
  });

  it('ignores none and missing canvas', () => {
    document.body.innerHTML = '';
    expect(() => playBuilderMotion('none')).not.toThrow();
    expect(() => playBuilderMotion('fade-up')).not.toThrow();
  });
});
