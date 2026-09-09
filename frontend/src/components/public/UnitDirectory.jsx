import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { sectionTitle } from '../../helpers/landingBlocks';

export function UnitDirectory({ units = [], title }) {
  const items = units.filter((unit) => !unit.isDefault);
  if (!items.length) return null;
  const heading = sectionTitle(title, 'Fakultas dan unit');

  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <p className="text-sm text-primary">Direktori</p>
          <h2 className="mt-2 font-headline text-3xl text-neutral-900 md:text-4xl">{heading}</h2>
          <p className="public-copy mt-3 text-sm leading-7 md:text-base">
            Jelajahi portal masing-masing unit di lingkungan Universitas Andalas.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((unit, index) => (
            <li key={unit.id} data-aos="fade-up" data-aos-delay={Math.min(index * 80, 240)}>
              <Link
                to={ROUTES.unit(unit.slug)}
                className="group block overflow-hidden rounded-md border border-neutral-200 bg-base transition hover:border-primary"
              >
                {unit.cover?.url ? (
                  <img src={unit.cover.url} alt="" className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                ) : (
                  <div className="h-28 bg-mist" />
                )}
                <span className="block px-4 py-4">
                  <span className="flex items-center gap-3">
                    {unit.logo?.url ? (
                      <img src={unit.logo.url} alt="" className="h-10 w-10 shrink-0 object-contain" />
                    ) : null}
                    <span className="font-headline text-sm text-neutral-900 group-hover:text-primary">{unit.name}</span>
                  </span>
                  {unit.description ? (
                    <span className="public-copy mt-2 line-clamp-3 block text-sm leading-6">{unit.description}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
