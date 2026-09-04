import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { ROUTES } from '../../constants/routes';
import { PERIODS, PERIOD_LABELS } from '../../helpers/periodFilter';
import { formatDateId } from '../../helpers/cmsDisplay';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicPosts } from '../../hooks/useCms';

export default function PublicPostListPage() {
  const { unitSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const period = searchParams.get('period') || 'all';
  const site = usePublicSiteUnit(unitSlug);
  const postsQuery = usePublicPosts(site.slug, {
    limit: 20,
    category,
    period: period === 'all' ? undefined : period,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || postsQuery.isLoading) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout unit={unit} menus={menus} seo={{ title: 'Pengumuman' }}>
      <InnerPageShell
        unit={unit}
        unitSlug={site.pathSlug}
        title="Pengumuman"
        description="Pengumuman, surat edaran, dan informasi akademik terbaru."
        crumbs={[{ label: 'Pengumuman' }]}
        currentHref={ROUTES.unitPosts(site.pathSlug)}
      >
        <label className="block text-sm text-neutral-600">
          Periode
          <select
            className="mt-1 block rounded-md border border-neutral-200 bg-surface px-3 py-2 text-neutral-800"
            value={period}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value === 'all') next.delete('period');
              else next.set('period', event.target.value);
              setSearchParams(next);
            }}
          >
            {PERIODS.map((value) => (
              <option key={value} value={value}>
                {PERIOD_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <ul className="mt-8 divide-y divide-neutral-200">
          {(postsQuery.data?.items || []).map((item) => (
            <li key={item.id} className="py-4 first:pt-0">
              <p className="text-xs text-neutral-500">
                {item.category?.name}
                {item.publishedAt ? ` · ${formatDateId(item.publishedAt)}` : ''}
              </p>
              <Link to={ROUTES.unitPost(site.pathSlug, item.slug)} className="mt-1 block font-headline text-lg text-neutral-900 hover:text-primary">
                {item.title}
              </Link>
              {item.excerpt ? <p className="mt-1 text-sm text-neutral-600">{item.excerpt}</p> : null}
            </li>
          ))}
        </ul>
        {!postsQuery.data?.items?.length ? <p className="mt-6 text-sm text-neutral-600">Belum ada pengumuman.</p> : null}
      </InnerPageShell>
    </PublicLayout>
  );
}
