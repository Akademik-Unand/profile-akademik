import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { sectionTitle } from '../../helpers/landingBlocks';

export function UnitDirectory({ units = [], title }) {
  const items = units.filter((unit) => !unit.isDefault);
  if (!items.length) return null;
  const heading = sectionTitle(title, 'Unit');

  return (
    <section className="bg-mist py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-headline text-3xl text-neutral-900" data-aos="fade-up">
          {heading}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((unit, index) => (
            <li key={unit.id} data-aos="fade-up" data-aos-delay={Math.min(index * 80, 240)}>
              <Link
                to={ROUTES.unit(unit.slug)}
                className="block overflow-hidden rounded-md border border-neutral-200 bg-surface hover:border-primary"
              >
                {unit.cover?.url ? (
                  <img src={unit.cover.url} alt="" className="h-40 w-full object-cover" />
                ) : null}
                <span className="block px-4 py-4">
                  <span className="flex items-center gap-3">
                    {unit.logo?.url ? (
                      <img src={unit.logo.url} alt="" className="h-10 w-10 shrink-0 object-contain" />
                    ) : null}
                    <span className="font-headline text-sm text-neutral-900">{unit.name}</span>
                  </span>
                  {unit.description ? (
                    <span className="mt-2 line-clamp-3 block text-sm leading-6 text-neutral-600">{unit.description}</span>
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
