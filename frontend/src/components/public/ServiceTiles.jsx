import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { landingServiceItems, sectionTitle } from '../../helpers/landingBlocks';

export function ServiceTiles({ landing, unitSlug }) {
  const items = landingServiceItems(landing?.services, unitSlug);
  if (!items.length) return null;
  const heading = sectionTitle(landing?.servicesTitle, 'Akses layanan akademik');
  const columns = items.length >= 6 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="bg-surface py-16 md:py-20" data-landing-services>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-sm text-primary">Layanan</p>
          <h2 className="mt-2 font-headline text-3xl text-neutral-900 md:text-4xl">{heading}</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600 md:text-base">
            Pintasan ke sistem dan informasi yang sering dibutuhkan mahasiswa dan dosen.
          </p>
        </div>
        <div className={`mt-10 grid gap-3 ${columns}`}>
          {items.map((item, index) => {
            const className =
              'group flex items-center gap-4 rounded-md border border-neutral-200 bg-base px-5 py-5 text-left transition hover:border-primary hover:bg-mist';
            const inner = (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-mist text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon icon={item.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-neutral-900">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-neutral-500">Buka layanan</span>
                </span>
              </>
            );
            return item.external ? (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 60, 240)}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={item.key}
                to={item.url}
                className={className}
                data-aos="fade-up"
                data-aos-delay={Math.min(index * 60, 240)}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
