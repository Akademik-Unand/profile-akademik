import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { resolveHeroSlides } from '../../helpers/heroSlides';
import { publicHref } from '../../helpers/publicHref';

function HeroCta({ href, label, variant }) {
  if (!href || !label) return null;
  const className =
    variant === 'solid'
      ? 'inline-flex rounded-md bg-white px-5 py-2.5 text-sm text-hero hover:bg-white/90'
      : 'inline-flex rounded-md border border-white/70 bg-transparent px-5 py-2.5 text-sm text-white hover:bg-white/10';
  if (href.startsWith('http')) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {label}
    </Link>
  );
}

export function HeroCarousel({ landing, posts = [], unitSlug, overlap = false }) {
  const slides = resolveHeroSlides(landing, posts, unitSlug);
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
      setFadeKey((key) => key + 1);
    }, 7500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];
  const brand = landing?.eyebrow || 'Universitas Andalas';
  const title = slide?.title || landing?.heroTitle || 'Layanan akademik yang andal dan transparan';
  const excerpt =
    slide?.excerpt ||
    landing?.heroSubtitle ||
    'Informasi pengumuman, pendaftaran, dan kalender akademik dalam satu portal.';
  const ctaLabel = landing?.ctaLabel || 'Lihat pengumuman';
  const ctaHref = slide?.href || landing?.ctaUrl || publicHref(unitSlug, 'posts');
  const secondaryLabel = landing?.secondaryCtaLabel || 'Jelajahi portal';
  const secondaryHref = landing?.secondaryCtaUrl || ROUTES.unitPage(unitSlug, 'profil');

  return (
    <section
      className="relative flex min-h-[min(100svh,52rem)] items-end overflow-hidden bg-hero md:min-h-svh"
      data-landing-hero
    >
      {slide?.image ? (
        <div
          key={`${slide.id || index}-${fadeKey}`}
          className="landing-hero-bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${slide.image}")` }}
          role="img"
          aria-label={title}
          data-landing-hero-bg
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-hero via-hero/55 to-black/30" />
      <div
        className={`relative z-10 mx-auto w-full max-w-7xl px-4 pt-chrome md:px-6 ${overlap ? 'pb-28 md:pb-36' : 'pb-16 md:pb-20'}`}
        data-landing-hero-copy
      >
        <p className="font-headline text-lg text-white md:text-xl">{brand}</p>
        <h1 className="mt-3 max-w-3xl font-headline text-4xl leading-tight text-white md:text-6xl md:leading-[1.08]">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/80 md:text-lg md:leading-8">{excerpt}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <HeroCta href={ctaHref} label={ctaLabel} variant="solid" />
          <HeroCta href={secondaryHref} label={secondaryLabel} variant="outline" />
        </div>
        {slides.length > 1 ? (
          <div className="mt-10 flex gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={`h-1 w-10 rounded-full transition ${itemIndex === index ? 'bg-white' : 'bg-white/35'}`}
                onClick={() => {
                  setIndex(itemIndex);
                  setFadeKey((key) => key + 1);
                }}
                aria-label={`Slide ${itemIndex + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
