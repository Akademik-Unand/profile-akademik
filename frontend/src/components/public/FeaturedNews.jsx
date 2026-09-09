import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatDateId } from '../../helpers/cmsDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';

export function FeaturedNews({ posts = [], unitSlug, title }) {
  const [featured, ...rest] = posts;
  if (!posts.length) return null;
  const heading = sectionTitle(title, 'Berita terkini');

  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4" data-aos="fade-up">
          <div>
            <p className="text-sm text-primary">Berita</p>
            <h2 className="mt-2 font-headline text-3xl text-neutral-900 md:text-4xl">{heading}</h2>
          </div>
          <Link to={ROUTES.unitPosts(unitSlug)} className="text-sm text-primary hover:text-primary-hover">
            Baca berita lainnya →
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
          {featured ? (
            <Link to={ROUTES.unitPost(unitSlug, featured.slug)} className="group block" data-aos="fade-up">
              <div className="relative overflow-hidden rounded-md bg-hero">
                {featured.cover?.url ? (
                  <img
                    src={featured.cover.url}
                    alt=""
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-[1.03] md:h-[28rem]"
                  />
                ) : (
                  <div className="h-72 md:h-[28rem]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-hero via-hero/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="text-xs text-white/70">
                    {featured.publishedAt ? formatDateId(featured.publishedAt) : featured.category?.name}
                  </p>
                  <h3 className="mt-2 font-headline text-2xl leading-snug text-white md:text-3xl">{featured.title}</h3>
                </div>
              </div>
              {featured.excerpt ? <p className="public-copy mt-4 text-sm leading-7 md:text-base">{featured.excerpt}</p> : null}
            </Link>
          ) : null}
          <div className="flex flex-col divide-y divide-neutral-200" data-aos="fade-up" data-aos-delay="120">
            {rest.slice(0, 4).map((item) => (
              <Link key={item.id} to={ROUTES.unitPost(unitSlug, item.slug)} className="group flex gap-4 py-5 first:pt-0 last:pb-0">
                {item.cover?.url ? (
                  <img src={item.cover.url} alt="" className="h-24 w-32 shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="h-24 w-32 shrink-0 rounded-md bg-mist" />
                )}
                <span className="min-w-0">
                  <span className="block text-xs text-neutral-600">
                    {item.publishedAt ? formatDateId(item.publishedAt) : item.category?.name}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-neutral-800 group-hover:text-primary">{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
