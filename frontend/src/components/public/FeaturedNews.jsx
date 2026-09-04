import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatDateId } from '../../helpers/cmsDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';

export function FeaturedNews({ posts = [], unitSlug, title }) {
  const [featured, ...rest] = posts;
  if (!posts.length) return null;
  const heading = sectionTitle(title, 'Berita utama');

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between" data-aos="fade-up">
          <h2 className="font-headline text-3xl text-neutral-900">{heading}</h2>
          <Link to={ROUTES.unitPosts(unitSlug)} className="text-sm text-primary">
            Lihat semua
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {featured ? (
            <Link to={ROUTES.unitPost(unitSlug, featured.slug)} className="block" data-aos="fade-up">
              <div className="relative overflow-hidden rounded-md bg-hero">
                {featured.cover?.url ? (
                  <img src={featured.cover.url} alt="" className="h-72 w-full object-cover md:h-[28rem]" />
                ) : (
                  <div className="h-72 md:h-[28rem]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-hero via-hero/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-xs text-white/70">
                    {featured.category?.name}
                    {featured.publishedAt ? ` · ${formatDateId(featured.publishedAt)}` : ''}
                  </p>
                  <h3 className="mt-2 font-headline text-2xl text-white md:text-3xl">{featured.title}</h3>
                </div>
              </div>
              {featured.excerpt ? <p className="mt-3 text-sm text-neutral-600">{featured.excerpt}</p> : null}
            </Link>
          ) : null}
          <div className="flex flex-col divide-y divide-neutral-200" data-aos="fade-up" data-aos-delay="120">
            {rest.slice(0, 5).map((item) => (
              <Link key={item.id} to={ROUTES.unitPost(unitSlug, item.slug)} className="flex gap-4 py-4 first:pt-0">
                {item.cover?.url ? (
                  <img src={item.cover.url} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
                ) : (
                  <div className="h-20 w-28 shrink-0 rounded-md bg-mist" />
                )}
                <span>
                  <span className="block text-xs text-neutral-500">
                    {item.publishedAt ? formatDateId(item.publishedAt) : item.category?.name}
                  </span>
                  <span className="mt-1 block text-sm text-neutral-800">{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
