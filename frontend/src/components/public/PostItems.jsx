import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { formatDateId } from '../../helpers/cmsDisplay';
import { postDisplay, showDataField } from '../../helpers/dataDisplay';

function PostMeta({ item, display }) {
  const parts = [];
  if (showDataField(display, 'category') && item.category?.name) parts.push(item.category.name);
  if (showDataField(display, 'date') && item.publishedAt) parts.push(formatDateId(item.publishedAt));
  if (!parts.length) return null;
  return <p className="text-xs text-neutral-600">{parts.join(' · ')}</p>;
}

function PostBody({ item, pathSlug, display, titleClass }) {
  return (
    <>
      <PostMeta item={item} display={display} />
      {showDataField(display, 'title') ? (
        <Link to={ROUTES.unitPost(pathSlug, item.slug)} className={`mt-1 block text-neutral-900 hover:text-primary ${titleClass}`}>
          {item.title}
        </Link>
      ) : null}
      {showDataField(display, 'excerpt') && item.excerpt ? <p className="mt-1 text-sm text-neutral-700">{item.excerpt}</p> : null}
    </>
  );
}

/**
 * Daftar atau kisi kartu untuk item konten.
 */
export function PostItems({ items = [], pathSlug, display, emptyText = 'Belum ada konten.' }) {
  const view = postDisplay(display);
  if (!items.length) return <p className="mt-6 text-sm text-neutral-700">{emptyText}</p>;

  if (view.layout === 'cards') {
    return (
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-neutral-200 bg-surface p-4">
            {showDataField(view, 'cover') && item.cover?.url ? (
              <img src={item.cover.url} alt="" className="mb-3 h-36 w-full rounded-md object-cover" />
            ) : null}
            <PostBody item={item} pathSlug={pathSlug} display={view} titleClass="font-headline text-lg" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-neutral-200">
      {items.map((item) => (
        <li key={item.id} className="flex gap-4 py-4 first:pt-0">
          {showDataField(view, 'cover') && item.cover?.url ? (
            <img src={item.cover.url} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
          ) : null}
          <div className="min-w-0">
            <PostBody item={item} pathSlug={pathSlug} display={view} titleClass="font-headline text-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
