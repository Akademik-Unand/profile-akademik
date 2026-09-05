import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { InnerPageShell, InnerPageSkeleton } from '../../components/public/InnerPageShell';
import { AgendaList } from '../../components/public/AgendaList';
import { usePublicSiteUnit } from '../../hooks/useUnits';
import { usePublicAgendas } from '../../hooks/useCms';

export default function PublicAgendaPage() {
  const { unitSlug } = useParams();
  const site = usePublicSiteUnit(unitSlug);
  const agendaQuery = usePublicAgendas(site.slug, { limit: 50, sortBy: 'startsAt', sortOrder: 'asc' });
  const unit = site.data;
  const menus = unit?.menus || [];

  if (site.isLoading || agendaQuery.isLoading) {
    return (
      <PublicLayout unit={unit} menus={menus}>
        <InnerPageSkeleton wide />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout unit={unit} menus={menus} seo={{ title: 'Agenda kegiatan' }}>
      <InnerPageShell
        unit={unit}
        unitSlug={site.pathSlug}
        title="Agenda kegiatan"
        description="Jadwal kegiatan akademik dan kemahasiswaan yang dipublikasikan unit ini."
        crumbs={[{ label: 'Agenda' }]}
        chrome="shell"
        sidebar="auto"
      >
        <AgendaList items={agendaQuery.data?.items || []} />
      </InnerPageShell>
    </PublicLayout>
  );
}
