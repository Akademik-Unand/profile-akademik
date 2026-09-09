import { useSearchParams } from 'react-router-dom';
import { PERIODS, PERIOD_LABELS } from '../../helpers/periodFilter';
import { usePublicCategories, usePublicPosts } from '../../hooks/useCms';
import { PostItems } from './PostItems';

export function PostArchive({ apiSlug, pathSlug, display, sampleItems, emptyText = 'Belum ada konten.', renderItems }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const period = searchParams.get('period') || 'all';
  const page = Number(searchParams.get('page') || 1);
  const postsQuery = usePublicPosts(apiSlug, {
    page,
    limit: 10,
    category,
    period: period === 'all' ? undefined : period,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const categoriesQuery = usePublicCategories(apiSlug);
  const totalPages = Math.max(1, Math.ceil((postsQuery.data?.total || 0) / (postsQuery.data?.limit || 10)));

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  if (postsQuery.isLoading) {
    return <div className="skeleton h-64 w-full" />;
  }

  const items = postsQuery.data?.items || [];
  const list = items.length ? items : sampleItems || [];
  const usingSample = !items.length && list.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-md border px-3 py-1.5 text-sm ${!category ? 'border-primary text-primary' : 'border-neutral-200 text-neutral-700'}`}
          onClick={() => setParam('category')}
        >
          Semua
        </button>
        {(categoriesQuery.data?.items || []).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-md border px-3 py-1.5 text-sm ${category === item.slug ? 'border-primary text-primary' : 'border-neutral-200 text-neutral-700'}`}
            onClick={() => setParam('category', item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <label className="mt-6 block text-sm text-neutral-700">
        Periode
        <select
          className="mt-1 block rounded-md border border-neutral-200 bg-surface px-3 py-2 text-neutral-800"
          value={period}
          onChange={(event) => setParam('period', event.target.value === 'all' ? '' : event.target.value)}
        >
          {PERIODS.map((value) => (
            <option key={value} value={value}>
              {PERIOD_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      {usingSample ? <p className="mt-6 text-sm text-neutral-600">Belum ada konten terbit — ini contoh tampilan.</p> : null}
      {renderItems ? renderItems(list) : <PostItems items={list} pathSlug={pathSlug} display={display} emptyText={emptyText} />}
      {totalPages > 1 ? (
        <div className="mt-8 flex items-center gap-3 text-sm">
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-3 py-1.5 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setParam('page', String(page - 1))}
          >
            Sebelumnya
          </button>
          <span className="text-neutral-700">
            Halaman {page} dari {totalPages}
          </span>
          <button
            type="button"
            className="rounded-md border border-neutral-200 px-3 py-1.5 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setParam('page', String(page + 1))}
          >
            Berikutnya
          </button>
        </div>
      ) : null}
    </div>
  );
}
