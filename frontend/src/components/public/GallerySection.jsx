import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import { landingGalleryItems, sectionTitle, splitGalleryMosaic } from '../../helpers/landingBlocks';

function mosaicFeaturedClass(restCount) {
  if (restCount === 0) return 'col-span-2 min-h-[22rem] lg:col-span-4 lg:min-h-[28rem]';
  if (restCount === 1) return 'col-span-2 min-h-[18rem] lg:min-h-[24rem]';
  return 'col-span-2 row-span-2 min-h-[22rem]';
}

function GalleryTile({ item, className, onOpen, aos, delay }) {
  return (
    <button
      type="button"
      className={`relative block overflow-hidden rounded-md bg-hero text-left ${className}`}
      onClick={onOpen}
      data-aos={aos}
      data-aos-delay={delay}
    >
      <img src={item.url} alt={item.caption || ''} className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-hero/80 via-transparent to-transparent" />
      {item.caption ? (
        <span className="absolute inset-x-0 bottom-0 p-3 text-sm text-white md:p-4">{item.caption}</span>
      ) : null}
    </button>
  );
}

export function GallerySection({ landing }) {
  const items = landingGalleryItems(landing?.gallery || []);
  const { featured, rest } = splitGalleryMosaic(items);
  const [activeIndex, setActiveIndex] = useState(null);
  const heading = sectionTitle(landing?.galleryTitle, 'Kehidupan kampus');
  const subtitle = sectionTitle(
    landing?.gallerySubtitle,
    'Dokumentasi kegiatan, fasilitas, dan suasana akademik.',
  );

  useEffect(() => {
    if (activeIndex == null) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current + 1) % items.length);
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current - 1 + items.length) % items.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, items.length]);

  if (!featured) return null;
  const active = activeIndex == null ? null : items[activeIndex];

  function openItem(item) {
    setActiveIndex(items.findIndex((row) => row.key === item.key));
  }

  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-sm text-primary">Galeri</p>
          <h2 className="mt-2 font-headline text-3xl text-neutral-900 md:text-4xl">{heading}</h2>
          {subtitle ? <p className="public-copy mt-3 text-sm leading-7 md:text-base">{subtitle}</p> : null}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-2 lg:grid-cols-4" data-landing-gallery>
          <GalleryTile
            key={featured.key}
            item={featured}
            className={mosaicFeaturedClass(rest.length)}
            onOpen={() => openItem(featured)}
            aos="fade-up"
          />
          {rest.map((item, index) => (
            <GalleryTile
              key={item.key}
              item={item}
              className="min-h-44 lg:min-h-52"
              onOpen={() => openItem(item)}
              aos="fade-up"
              delay={Math.min((index + 1) * 80, 240)}
            />
          ))}
        </div>
      </div>
      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-neutral-900/80" aria-label="Tutup" onClick={() => setActiveIndex(null)} />
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <button
              type="button"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setActiveIndex(null)}
              aria-label="Tutup"
            >
              <Icon icon="mdi:close" className="size-6" />
            </button>
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-hero/70 p-2 text-white"
                  aria-label="Sebelumnya"
                  onClick={() => setActiveIndex((current) => (current - 1 + items.length) % items.length)}
                >
                  <Icon icon="mdi:chevron-left" className="size-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-hero/70 p-2 text-white"
                  aria-label="Berikutnya"
                  onClick={() => setActiveIndex((current) => (current + 1) % items.length)}
                >
                  <Icon icon="mdi:chevron-right" className="size-6" />
                </button>
              </>
            ) : null}
            <img src={active.url} alt={active.caption || ''} className="max-h-[90vh] w-full rounded-md object-contain" />
            {active.caption ? <p className="mt-3 text-center text-sm text-white">{active.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
