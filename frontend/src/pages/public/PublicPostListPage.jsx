import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { PostArchive } from '../../components/public/PostArchive';
import { ROUTES } from '../../constants/routes';
import { usePublicSiteUnit } from '../../hooks/useUnits';

export default function PublicPostListPage() {
  const { unitSlug } = useParams();
  const site = usePublicSiteUnit(unitSlug);
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading) {
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
        <PostArchive apiSlug={site.slug} pathSlug={site.pathSlug} emptyText="Belum ada pengumuman." />
      </InnerPageShell>
    </PublicLayout>
  );
}
