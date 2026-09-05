import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HtmlContent } from '../../components/public/HtmlContent';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { BuilderRender } from '../../builder/BuilderRender';
import { ROUTES } from '../../constants/routes';
import { hasBuilder, layoutFromRecord, resolvePageDocument } from '../../helpers/builderDocument';
import { publicPageHref } from '../../helpers/systemPageHref';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicPage } from '../../hooks/useCms';

export default function PublicPagePage({ pageSlug: forcedSlug, Fallback }) {
  const { unitSlug, pageSlug: paramSlug } = useParams();
  const pageSlug = forcedSlug || paramSlug;
  const site = usePublicSiteUnit(unitSlug);
  const pageQuery = usePublicPage(site.slug, pageSlug);
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || !site.slug || pageQuery.isLoading || pageQuery.isPending) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  if (pageQuery.isError || !pageQuery.data?.page) {
    if (Fallback) return <Fallback />;
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
  const layout = layoutFromRecord(page);
  const document = resolvePageDocument(page);
  const body = hasBuilder(document) ? (
    <BuilderRender document={document} unit={unit} unitSlug={site.pathSlug} />
  ) : (
    <HtmlContent html={page.content} />
  );

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
        currentHref={publicPageHref(site.pathSlug, page.slug)}
        pageSlug={page.slug}
        updatedAt={page.updatedAt}
        chrome={layout.chrome}
        sidebar={layout.sidebar}
        showHero={layout.showHero !== false}
        background={layout.background}
      >
        {body}
      </InnerPageShell>
    </PublicLayout>
  );
}
