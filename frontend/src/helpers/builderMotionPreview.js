/**
 * Putar ulang efek di kanvas editor tanpa menghidupkan AOS.
 */
export function playBuilderMotion(effect, duration = 700) {
  if (typeof document === 'undefined' || !effect || effect === 'none') return;
  const canvas = document.querySelector('.builder-canvas');
  if (!canvas) return;

  const matched = [...canvas.querySelectorAll('[data-aos]')].filter((node) => node.getAttribute('data-aos') === effect);
  const nodes = matched.length ? matched : [...canvas.querySelectorAll('[data-puck-component]')].slice(0, 1);
  const ms = Math.max(400, Math.min(1200, Number(duration) || 700));

  nodes.forEach((node) => {
    node.classList.remove('builder-motion-play');
    node.removeAttribute('data-builder-motion');
    node.style.removeProperty('--builder-motion-ms');
    void node.offsetWidth;
    node.dataset.builderMotion = effect;
    node.style.setProperty('--builder-motion-ms', `${ms}ms`);
    node.classList.add('builder-motion-play');
    window.setTimeout(() => {
      node.classList.remove('builder-motion-play');
    }, ms + 80);
  });
}
