import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../../components/public/InnerPageShell';
import { BuilderRender } from '../../../builder/BuilderRender';
import { HtmlContent } from '../../../components/public/HtmlContent';
import { useAdminPage } from '../../../hooks/useCms';
import { hasBuilder, layoutFromRecord, resolvePageDocument } from '../../../helpers/builderDocument';
import { ROUTES } from '../../../constants/routes';
import { publicPageHref } from '../../../helpers/systemPageHref';

export default function PagePreviewPage() {
  const { id } = useParams();
  const query = useAdminPage(id);
  const page = query.data;

  if (query.isLoading) {
    return (
      <PublicLayout preview>
        <InnerPageSkeleton />
      </PublicLayout>
    );
  }

  if (!page) {
    return (
      <PublicLayout preview>
        <p className="px-4 py-24 text-sm">Halaman tidak ditemukan.</p>
      </PublicLayout>
    );
  }

  const layout = layoutFromRecord(page);
  const document = resolvePageDocument(page);
  const body = hasBuilder(document) ? (
    <BuilderRender document={document} unit={page.unit} unitSlug={page.unit?.isDefault ? '' : page.unit?.slug} />
  ) : (
    <HtmlContent html={page.content} />
  );

  return (
    <PublicLayout unit={page.unit} seo={{ title: `Pratinjau: ${page.title}` }} preview>
      <p className="bg-warning/20 px-4 py-2 text-center text-sm">
        Pratinjau draf.{' '}
        <Link to={ROUTES.adminPageBuilder(id)} className="text-primary">
          Kembali ke editor
        </Link>
      </p>
      <InnerPageShell
        unit={page.unit}
        unitSlug={page.unit?.isDefault ? '' : page.unit?.slug}
        title={page.title}
        description={page.metaDescription}
        crumbs={[{ label: page.title }]}
        currentHref={publicPageHref(page.unit?.isDefault ? '' : page.unit?.slug, page.slug)}
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
