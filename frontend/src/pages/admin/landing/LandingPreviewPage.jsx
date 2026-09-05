import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { LandingPageSkeleton } from '../../../components/public/LandingPageSkeleton';
import { BuilderRender } from '../../../builder/BuilderRender';
import { UnitHomeSections } from '../../../components/public/UnitHomeSections';
import { useLandingCurrent } from '../../../hooks/useCms';
import { usePublicUnits } from '../../../hooks/useUnits';
import { hasBuilder, resolveLandingDocument } from '../../../helpers/builderDocument';
import { ROUTES } from '../../../constants/routes';

export default function LandingPreviewPage() {
  const [params] = useSearchParams();
  const unitId = params.get('unitId') || '';
  const queryParams = !unitId || params.get('site') === 'main' ? { site: 'main' } : { unitId };
  const landingQuery = useLandingCurrent(queryParams);
  const unitsQuery = usePublicUnits({ limit: 50 });
  const units = unitsQuery.data?.items || [];
  const unit =
    (unitId && units.find((item) => String(item.id) === String(unitId))) ||
    units.find((item) => item.isDefault) ||
    units[0];
  const landing = landingQuery.data;
  const editorHref = unitId ? `${ROUTES.adminLandingBuilder}?unitId=${unitId}` : `${ROUTES.adminLandingBuilder}?site=main`;

  if (landingQuery.isLoading) {
    return (
      <PublicLayout preview previewBackTo={editorHref}>
        <LandingPageSkeleton />
      </PublicLayout>
    );
  }

  const document = resolveLandingDocument(landing);
  const previewUnit = { ...unit, landing };

  return (
    <PublicLayout
      unit={unit}
      menus={unit?.menus || []}
      transparent
      preview
      previewBackTo={editorHref}
      seo={{ title: 'Pratinjau beranda' }}
    >
      {hasBuilder(document) ? (
        <BuilderRender document={document} unit={previewUnit} unitSlug={unit?.isDefault ? '' : unit?.slug} />
      ) : (
        <UnitHomeSections unit={previewUnit} />
      )}
    </PublicLayout>
  );
}
