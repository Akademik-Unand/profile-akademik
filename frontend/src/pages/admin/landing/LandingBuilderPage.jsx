import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BuilderWorkspace } from '../../../builder/BuilderWorkspace';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { emptyBuilder, landingToBuilder, publishDocument, resolveLandingDocument } from '../../../helpers/builderDocument';
import { extractLandingLegacy } from '../../../helpers/landingFromBuilder';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { landingBuilderHref } from '../../../helpers/pageListActions';
import { withPreviewQuery } from '../../../helpers/previewHref';
import { useLandingCurrent, useUpsertLanding } from '../../../hooks/useCms';
import { usePublicUnits } from '../../../hooks/useUnits';
import { ROUTES } from '../../../constants/routes';
import { useAuthStore } from '../../../store/auth.store';

const PageBuilder = lazy(() => import('../../../builder/PageBuilder').then((mod) => ({ default: mod.PageBuilder })));

export default function LandingBuilderPage() {
  const user = useAuthStore((s) => s.user);
  const isSuper = user?.role === 'superadmin';
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const unitId = params.get('unitId') || (isSuper ? '' : user?.units?.[0]?.id || '');
  const site = isSuper && (params.get('site') === 'main' || !unitId) ? 'main' : undefined;
  const queryParams = site === 'main' ? { site: 'main' } : { unitId };
  const query = useLandingCurrent(queryParams);
  const save = useUpsertLanding();
  const unitsQuery = usePublicUnits({ limit: 50 });
  const units = unitsQuery.data?.items || [];
  const unit =
    (unitId && units.find((item) => String(item.id) === String(unitId))) ||
    (site === 'main' ? units.find((item) => item.isDefault) : null) ||
    units.find((item) => item.isDefault) ||
    units[0];
  const scopeKey = unitId || 'main';
  const [builder, setBuilder] = useState(null);
  const builderRef = useRef(builder);
  builderRef.current = builder;
  const [canvasKey, setCanvasKey] = useState(scopeKey);

  const landingReady = Boolean(query.data);
  useEffect(() => {
    if (!query.data) return;
    setBuilder(resolveLandingDocument(query.data));
    setCanvasKey(scopeKey);
  }, [scopeKey, landingReady]);

  const previewHref = withPreviewQuery(
    `${ROUTES.adminLandingPreview}${unitId ? `?unitId=${unitId}` : '?site=main'}`,
  );
  const unitSlug = unit?.isDefault || site === 'main' ? '' : unit?.slug || '';

  async function persist(next) {
    const document = publishDocument(next, builderRef.current) || emptyBuilder();
    const legacy = extractLandingLegacy(document);
    await save.mutateAsync({
      unitId: payloadUnitId(unitId),
      site: site === 'main' ? 'main' : undefined,
      ...legacy,
      builder: document,
    });
  }

  return (
    <BuilderWorkspace
      title="Editor beranda"
      subtitle={unitId ? `Lingkup: ${unit?.name || 'Unit'}` : 'Lingkup: Situs utama'}
      backTo={ROUTES.adminPages}
      previewHref={previewHref}
      onSave={() => persist()}
      saving={save.isPending}
      extraActions={
        <>
          <UnitSelect
            value={unitId}
            onChange={(value) => navigate(landingBuilderHref(value === 'main' ? '' : value))}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setBuilder(landingToBuilder(query.data || {}));
              setCanvasKey(`${scopeKey}-default`);
            }}
          >
            Pakai susunan default
          </button>
        </>
      }
    >
      {query.isLoading || unitsQuery.isLoading || !builder ? (
        <div className="skeleton h-full w-full" />
      ) : (
        <Suspense fallback={<div className="skeleton h-full w-full" />}>
          <PageBuilder
            resetKey={canvasKey}
            data={builder}
            onChange={setBuilder}
            liveRef={builderRef}
            onPublish={persist}
            unit={unit || null}
            unitSlug={unitSlug}
          />
        </Suspense>
      )}
    </BuilderWorkspace>
  );
}
