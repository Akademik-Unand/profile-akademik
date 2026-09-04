import { SiteBreadcrumb } from './SiteBreadcrumb';

/**
 * Banner judul halaman dalam (CMS, pengumuman, agenda).
 */
export function PageHero({ unitSlug, unitName, title, description, crumbs = [] }) {
  return (
    <section className="bg-hero text-white">
      <div className="mx-auto max-w-7xl px-4 pt-chrome pb-10 md:px-6 md:pb-12">
        <SiteBreadcrumb unitSlug={unitSlug} items={crumbs} tone="light" />
        {unitName ? <p className="mt-6 text-sm text-white/70">{unitName}</p> : null}
        {title ? <h1 className="mt-2 max-w-3xl font-headline text-3xl md:text-4xl">{title}</h1> : null}
        {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">{description}</p> : null}
      </div>
      <div className="h-1 bg-primary" />
    </section>
  );
}
