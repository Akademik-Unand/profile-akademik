import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { datePartsId } from '../../helpers/cmsDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';

export function Announcements({ posts = [], unitSlug, title }) {
  if (!posts.length) return null;
  const heading = sectionTitle(title, 'Pengumuman');

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-primary">Informasi resmi</p>
          <h2 className="mt-1 font-headline text-2xl text-neutral-900 md:text-3xl">{heading}</h2>
        </div>
        <Link to={`${ROUTES.unitPosts(unitSlug)}?category=pengumuman`} className="shrink-0 text-sm text-primary">
          Semua
        </Link>
      </div>
      <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
        {posts.map((item) => {
          const date = datePartsId(item.publishedAt);
          return (
            <li key={item.id}>
              <Link to={ROUTES.unitPost(unitSlug, item.slug)} className="flex gap-4 py-5 hover:bg-surface/80">
                {date ? (
                  <span className="w-14 shrink-0 text-center">
                    <span className="block font-headline text-2xl text-primary">{date.day}</span>
                    <span className="text-xs uppercase tracking-wide text-neutral-600">{date.month}</span>
                  </span>
                ) : null}
                <span className="min-w-0 pt-1">
                  <span className="block text-sm leading-6 text-neutral-900">{item.title}</span>
                  {item.category?.name ? <span className="mt-1 block text-xs text-neutral-600">{item.category.name}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
