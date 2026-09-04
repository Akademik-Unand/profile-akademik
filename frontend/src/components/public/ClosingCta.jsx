import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { closingCtaCopy } from '../../helpers/landingBlocks';
import { publicHref } from '../../helpers/publicHref';

function CtaLink({ to, external, children }) {
  const className =
    'inline-flex rounded-md border border-white/70 px-5 py-2.5 text-sm text-white hover:bg-white/10';
  if (external) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function ClosingCta({ landing, unit, unitSlug }) {
  const { title, body } = closingCtaCopy(landing, unit?.name);
  const ctaLabel = landing?.ctaLabel || 'Lihat pengumuman';
  const ctaHref = landing?.ctaUrl || publicHref(unitSlug, 'posts');
  const ctaExternal = /^https?:\/\//i.test(ctaHref);

  return (
    <section className="bg-primary py-16 text-white md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="max-w-2xl" data-aos="fade-up">
          <h2 className="font-headline text-3xl leading-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-base leading-8 text-white/85 md:text-lg">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="120">
          <CtaLink to={ctaHref} external={ctaExternal}>
            {ctaLabel}
          </CtaLink>
          <CtaLink to={ROUTES.unitAgendas(unitSlug)}>Lihat agenda</CtaLink>
        </div>
      </div>
    </section>
  );
}
