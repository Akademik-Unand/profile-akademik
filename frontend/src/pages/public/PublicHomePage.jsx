import { PublicLayout } from '../../layouts/PublicLayout';
import { UnitHomeSections } from '../../components/public/UnitHomeSections';
import { LandingPageSkeleton } from '../../components/public/LandingPageSkeleton';
import { usePublicUnit, usePublicUnits } from '../../hooks/useUnits';

export default function PublicHomePage() {
  const listQuery = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' });
  const units = listQuery.data?.items || [];
  const fallback = units.find((unit) => unit.isDefault) || units[0];
  const unitQuery = usePublicUnit(fallback?.slug);

  if (listQuery.isLoading || (fallback && unitQuery.isLoading)) {
    return (
      <PublicLayout transparent>
        <LandingPageSkeleton />
      </PublicLayout>
    );
  }

  if (!fallback) {
    return (
      <PublicLayout>
        <p className="bg-base px-4 py-24 text-sm text-neutral-600">Belum ada unit yang dipublikasikan.</p>
      </PublicLayout>
    );
  }

  const unit = unitQuery.data || fallback;

  return (
    <PublicLayout unit={unit} menus={unit.menus || []} transparent>
      <UnitHomeSections unit={unit} />
    </PublicLayout>
  );
}
