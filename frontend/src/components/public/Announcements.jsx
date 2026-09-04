import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { datePartsId } from '../../helpers/cmsDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';

export function Announcements({ posts = [], unitSlug, title }) {
  if (!posts.length) return null;
  const heading = sectionTitle(title, 'Pengumuman');

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-headline text-2xl text-neutral-900">{heading}</h2>
        <Link to={`${ROUTES.unitPosts(unitSlug)}?category=pengumuman`} className="text-sm text-primary">
          Semua
        </Link>
      </div>
      <ul className="divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 bg-surface">
        {posts.map((item) => {
          const date = datePartsId(item.publishedAt);
          return (
            <li key={item.id}>
              <Link to={ROUTES.unitPost(unitSlug, item.slug)} className="flex gap-4 px-4 py-4 hover:bg-mist">
                {date ? (
                  <span className="w-14 shrink-0 text-center">
                    <span className="block font-headline text-xl text-primary">{date.day}</span>
                    <span className="text-xs uppercase text-neutral-500">{date.month}</span>
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block text-sm text-neutral-900">{item.title}</span>
                  {item.category?.name ? <span className="mt-1 block text-xs text-neutral-500">{item.category.name}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
