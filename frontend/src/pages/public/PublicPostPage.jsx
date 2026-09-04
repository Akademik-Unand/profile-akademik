import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HtmlContent } from '../../components/public/HtmlContent';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { ROUTES } from '../../constants/routes';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicPost } from '../../hooks/useCms';

export default function PublicPostPage() {
  const { unitSlug, postSlug } = useParams();
  const site = usePublicSiteUnit(unitSlug);
  const postQuery = usePublicPost(site.slug, postSlug);
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || postQuery.isLoading) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  if (postQuery.isError) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageShell unit={unit} unitSlug={site.pathSlug} title="Pengumuman tidak ditemukan">
          <p className="text-neutral-600">Pengumuman yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
          <Link to={ROUTES.unitPosts(site.pathSlug)} className="mt-4 inline-block text-sm text-primary">
            Lihat semua pengumuman
          </Link>
        </InnerPageShell>
      </PublicLayout>
    );
  }

  const post = postQuery.data.post;

  return (
    <PublicLayout
      unit={unit}
      menus={menus}
      seo={{
        title: post.title,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription || post.excerpt,
        metaKeywords: post.metaKeywords,
      }}
    >
      <InnerPageShell
        unit={unit}
        unitSlug={site.pathSlug}
        title={post.title}
        description={post.excerpt}
        eyebrow={post.category?.name}
        crumbs={[{ label: 'Pengumuman', to: ROUTES.unitPosts(site.pathSlug) }, { label: post.title }]}
        currentHref={ROUTES.unitPost(site.pathSlug, post.slug)}
        updatedAt={post.publishedAt}
      >
        {post.cover?.url ? (
          <img src={post.cover.url} alt="" className="mb-6 w-full rounded-md object-cover" />
        ) : null}
        <HtmlContent html={post.content} />
      </InnerPageShell>
    </PublicLayout>
  );
}
