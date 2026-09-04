import { Navigate, useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { UnitHomeSections } from '../../components/public/UnitHomeSections';
import { LandingPageSkeleton } from '../../components/public/LandingPageSkeleton';
import { usePublicUnit } from '../../hooks/useUnits';

export default function PublicUnitPage() {
  const { unitSlug } = useParams();
  const unitQuery = usePublicUnit(unitSlug);

  if (unitQuery.isLoading) {
    return (
      <PublicLayout transparent>
        <LandingPageSkeleton />
      </PublicLayout>
    );
  }

  if (unitQuery.isError || !unitQuery.data) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-5xl px-4 py-24">
          <h1 className="font-headline text-2xl">Unit tidak ditemukan</h1>
        </div>
      </PublicLayout>
    );
  }

  const unit = unitQuery.data;
  if (unit.isDefault) return <Navigate to="/" replace />;

  return (
    <PublicLayout unit={unit} menus={unit.menus || []} transparent>
      <UnitHomeSections unit={unit} />
    </PublicLayout>
  );
}
