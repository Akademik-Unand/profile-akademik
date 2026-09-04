import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { OrganizationTree } from '../../components/public/OrganizationTree';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicOrganization } from '../../hooks/useCms';

export default function PublicOrganizationPage() {
  const { unitSlug } = useParams();
  const site = usePublicSiteUnit(unitSlug);
  const orgQuery = usePublicOrganization(site.slug);
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || orgQuery.isLoading) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton wide />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout unit={unit} menus={menus} seo={{ title: 'Struktur organisasi' }}>
      <InnerPageShell
        unit={unit}
        unitSlug={site.pathSlug}
        title="Struktur organisasi"
        description="Susunan pejabat dan unit kerja yang dipublikasikan pada portal ini."
        crumbs={[{ label: 'Struktur organisasi' }]}
        wide
      >
        <OrganizationTree members={orgQuery.data?.items || []} />
      </InnerPageShell>
    </PublicLayout>
  );
}
