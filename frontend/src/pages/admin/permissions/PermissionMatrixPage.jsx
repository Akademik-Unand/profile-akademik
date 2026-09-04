import { useMemo, useState } from 'react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { RoleMatrixTable } from '../../../components/iam/RoleMatrixTable';
import { groupPermissions } from '../../../helpers/permissionGroups';
import { usePermissionMatrix, useSyncRolePermissions } from '../../../hooks/useIam';

export default function PermissionMatrixPage() {
  const { data, isLoading } = usePermissionMatrix();
  const syncRole = useSyncRolePermissions();
  const [draft, setDraft] = useState(null);

  if (data?.grants && draft === null) {
    setDraft(data.grants);
  }

  const groups = useMemo(() => groupPermissions(data?.permissions || []), [data]);
  const current = draft || data?.grants || {};

  function toggle(role, permissionId) {
    setDraft((prev) => {
      const base = prev || data?.grants || {};
      const list = base[role] || [];
      const next = list.includes(permissionId) ? list.filter((id) => id !== permissionId) : [...list, permissionId];
      return { ...base, [role]: next };
    });
  }

  async function save() {
    const role = data?.roles?.[0]?.name || 'admin_unit';
    const payload = await syncRole.mutateAsync({ role, permissionIds: current[role] || [] });
    if (payload?.data?.grants) setDraft(payload.data.grants);
  }

  if (isLoading) return <div className="skeleton h-64 w-full" />;

  return (
    <div>
      <PageHeader
        title="Permission"
        subtitle="Matriks akses peran admin unit. Superadmin selalu punya akses penuh."
        breadcrumbs={[{ label: 'Permission' }]}
        action={
          <button type="button" className="btn btn-primary" onClick={save} disabled={syncRole.isPending}>
            Simpan
          </button>
        }
      />
      <RoleMatrixTable roles={data?.roles || []} groups={groups} draft={current} onToggle={toggle} />
    </div>
  );
}
