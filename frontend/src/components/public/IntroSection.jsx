import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { introParagraphs } from '../../helpers/landingBlocks';

export function IntroSection({ landing, unitSlug, profileUrl }) {
  if (!landing?.introTitle && !landing?.introBody) return null;
  const [lead, ...rest] = introParagraphs(landing.introBody);
  const profilHref = profileUrl || ROUTES.unitPage(unitSlug, 'profil');

  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:items-start md:gap-16 md:px-6">
        <div className="md:col-span-5" data-aos="fade-up">
          {landing.introTitle ? (
            <h2 className="font-headline text-3xl leading-tight text-neutral-900 md:text-5xl">{landing.introTitle}</h2>
          ) : null}
          <span className="mt-6 block h-1 w-16 bg-primary" aria-hidden="true" />
        </div>
        <div className="md:col-span-7" data-aos="fade-up" data-aos-delay="120">
          {lead ? <p className="text-lg leading-8 text-neutral-800 md:text-xl md:leading-9">{lead}</p> : null}
          {rest.map((paragraph) => (
            <p key={paragraph} className="mt-5 text-base leading-8 text-neutral-600 md:text-lg">
              {paragraph}
            </p>
          ))}
          <Link to={profilHref} className="mt-8 inline-flex text-base text-primary hover:text-primary-hover">
            Baca profil
          </Link>
        </div>
      </div>
    </section>
  );
}
