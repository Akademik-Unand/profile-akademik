import { pageHeroCrumbs } from '../../helpers/pageHero';
import { SiteBreadcrumb } from './SiteBreadcrumb';

/**
 * Banner judul halaman dalam (CMS, pengumuman, agenda).
 */
export function PageHero({ unitSlug, unitName, title, description, crumbs = [] }) {
  const trail = pageHeroCrumbs(crumbs, title);

  return (
    <section className="border-b border-white/10 bg-hero text-white">
      <div className="mx-auto max-w-7xl px-4 pt-chrome pb-12 md:px-6 md:pb-14">
        <SiteBreadcrumb unitSlug={unitSlug} items={trail} tone="light" />
        <div className="mt-6 max-w-3xl">
          {unitName ? <p className="text-sm text-white/80">{unitName}</p> : null}
          {title ? (
            <h1 className={`max-w-3xl font-headline text-3xl leading-tight text-white md:text-4xl ${unitName ? 'mt-2' : ''}`}>
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">{description}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
