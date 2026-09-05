import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicHref } from '../../helpers/publicHref';
import { resolveHeroSlides } from '../../helpers/heroSlides';

export function HeroCarousel({ landing, posts = [], unitSlug, overlap = false }) {
  const slides = resolveHeroSlides(landing, posts, unitSlug);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];
  const title = slide?.title || landing?.heroTitle || 'Layanan akademik yang andal dan transparan';
  const excerpt = slide?.excerpt || landing?.heroSubtitle || 'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.';
  const ctaLabel = landing?.ctaLabel || 'Baca selengkapnya';
  const ctaHref = slide?.href || landing?.ctaUrl || publicHref(unitSlug, 'posts');
  const ctaClassName =
    'mt-8 inline-flex rounded-md border border-white/70 bg-transparent px-5 py-2.5 text-sm text-white hover:bg-white/10';

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-hero" data-landing-hero>
      {slide?.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url("${slide.image}")` }}
          role="img"
          aria-label={title}
          data-landing-hero-bg
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-hero/95 via-hero/40 to-black/25" />
      <div
        className={`relative z-10 mx-auto w-full max-w-7xl px-4 pt-chrome md:px-6 ${overlap ? 'pb-24 md:pb-32' : 'pb-16'}`}
        data-landing-hero-copy
      >
        {landing?.eyebrow ? <p className="text-sm text-white/70">{landing.eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl font-headline text-4xl text-white md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">{excerpt}</p>
        {ctaHref ? (
          ctaHref.startsWith('http') ? (
            <a href={ctaHref} className={ctaClassName}>
              {ctaLabel}
            </a>
          ) : (
            <Link to={ctaHref} className={ctaClassName}>
              {ctaLabel}
            </Link>
          )
        ) : null}
        {slides.length > 1 ? (
          <div className="mt-8 flex gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={`h-1.5 w-8 rounded-full ${itemIndex === index ? 'bg-white' : 'bg-white/30'}`}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Slide ${itemIndex + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
