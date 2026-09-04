import { resolveHeroSlides } from './heroSlides';

describe('resolveHeroSlides', () => {
  it('uses landing media as the background slides', () => {
    const slides = resolveHeroSlides(
      {
        heroTitle: 'Portal',
        slides: [{ id: 1, media: { url: 'https://img.test/kampus.jpg' }, title: 'Kampus' }],
      },
      [{ id: 9, slug: 'berita', title: 'Berita', cover: { url: 'https://img.test/post.jpg' } }],
      '',
    );
    expect(slides).toHaveLength(1);
    expect(slides[0].image).toBe('https://img.test/kampus.jpg');
    expect(slides[0].title).toBe('Kampus');
  });

  it('falls back to featured posts when no landing image exists', () => {
    const slides = resolveHeroSlides({}, [{ id: 9, slug: 'berita', title: 'Berita', cover: { url: 'https://img.test/post.jpg' } }], '');
    expect(slides[0].image).toBe('https://img.test/post.jpg');
    expect(slides[0].href).toBe('/pengumuman/berita');
  });
});
