import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HtmlContent } from '../../components/public/HtmlContent';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { ROUTES } from '../../constants/routes';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicPage } from '../../hooks/useCms';

export default function PublicPagePage() {
  const { unitSlug, pageSlug } = useParams();
  const site = usePublicSiteUnit(unitSlug);
  const pageQuery = usePublicPage(site.slug, pageSlug);
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || pageQuery.isLoading) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  if (pageQuery.isError) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageShell unit={unit} unitSlug={site.pathSlug} title="Halaman tidak ditemukan">
          <p className="text-neutral-600">Halaman yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
          <Link to={ROUTES.unit(site.pathSlug)} className="mt-4 inline-block text-sm text-primary">
            Kembali ke beranda
          </Link>
        </InnerPageShell>
      </PublicLayout>
    );
  }

  const page = pageQuery.data.page;

  return (
    <PublicLayout
      unit={unit}
      menus={menus}
      seo={{
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        metaKeywords: page.metaKeywords,
      }}
    >
      <InnerPageShell
        unit={unit}
        unitSlug={site.pathSlug}
        title={page.title}
        description={page.metaDescription}
        crumbs={[{ label: page.title }]}
        currentHref={ROUTES.unitPage(site.pathSlug, page.slug)}
        pageSlug={page.slug}
        updatedAt={page.updatedAt}
      >
        <HtmlContent html={page.content} />
      </InnerPageShell>
    </PublicLayout>
  );
}
