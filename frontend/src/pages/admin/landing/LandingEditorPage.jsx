import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { useAuthStore } from '../../../store/auth.store';
import { withPreviewQuery } from '../../../helpers/previewHref';
import { ROUTES } from '../../../constants/routes';

export default function LandingEditorPage() {
  const user = useAuthStore((s) => s.user);
  const isSuper = user?.role === 'superadmin';
  const [params, setParams] = useSearchParams();
  const unitId = params.get('unitId') || (isSuper ? '' : user?.units?.[0]?.id || '');

  function setUnitId(value) {
    const next = new URLSearchParams(params);
    if (value) next.set('unitId', value);
    else next.delete('unitId');
    setParams(next, { replace: true });
  }

  const editorHref = unitId ? `${ROUTES.adminLandingBuilder}?unitId=${unitId}` : `${ROUTES.adminLandingBuilder}?site=main`;
  const previewHref = withPreviewQuery(unitId ? `${ROUTES.adminLandingPreview}?unitId=${unitId}` : `${ROUTES.adminLandingPreview}?site=main`);

  return (
    <div className="w-full">
      <PageHeader
        title="Landing page"
        subtitle="Pilih lingkup, lalu buka editor penuh untuk menyusun beranda."
        breadcrumbs={[{ label: 'Landing page' }]}
      />
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-3 md:flex-row md:items-end">
          <AdminField label="Lingkup">
            <UnitSelect value={unitId} onChange={setUnitId} />
          </AdminField>
          <div className="flex flex-wrap gap-2">
            <a className="btn btn-primary" href={editorHref}>
              Buka editor
            </a>
            <a className="btn btn-ghost" href={previewHref} target="_blank" rel="noreferrer">
              Pratinjau
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
