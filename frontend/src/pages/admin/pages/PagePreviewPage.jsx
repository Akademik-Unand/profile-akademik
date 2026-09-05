import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../../components/public/InnerPageShell';
import { BuilderRender } from '../../../builder/BuilderRender';
import { HtmlContent } from '../../../components/public/HtmlContent';
import { useAdminPage } from '../../../hooks/useCms';
import { usePublicSiteUnit } from '../../../hooks/useUnits';
import { hasBuilder, layoutFromRecord, resolvePageDocument } from '../../../helpers/builderDocument';
import { ROUTES } from '../../../constants/routes';
import { publicPageHref } from '../../../helpers/systemPageHref';

export default function PagePreviewPage() {
  const { id } = useParams();
  const query = useAdminPage(id);
  const page = query.data;
  const site = usePublicSiteUnit(page?.unit && !page.unit.isDefault ? page.unit.slug : '');
  const unit = site.data || page?.unit;

  if (query.isLoading) {
    return (
      <PublicLayout preview previewBackTo={ROUTES.adminPages}>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  if (!page) {
    return (
      <PublicLayout preview previewBackTo={ROUTES.adminPages}>
        <p className="px-4 py-24 text-sm">Halaman tidak ditemukan.</p>
      </PublicLayout>
    );
  }

  const layout = layoutFromRecord(page);
  const document = resolvePageDocument(page);
  const body = hasBuilder(document) ? (
    <BuilderRender document={document} unit={unit} unitSlug={unit?.isDefault ? '' : unit?.slug} />
  ) : (
    <HtmlContent html={page.content} />
  );

  return (
    <PublicLayout unit={unit} seo={{ title: `Pratinjau: ${page.title}` }} preview previewBackTo={ROUTES.adminPageBuilder(id)}>
      <InnerPageShell
        unit={unit}
        unitSlug={unit?.isDefault ? '' : unit?.slug}
        title={page.title}
        description={page.metaDescription}
        crumbs={[{ label: page.title }]}
        currentHref={publicPageHref(unit?.isDefault ? '' : unit?.slug, page.slug)}
        pageSlug={page.slug}
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
