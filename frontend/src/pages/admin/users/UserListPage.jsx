import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Icon } from '../../../components/ui/Icon';
import { Can } from '../../../policies/AbilityContext';
import { ROUTES } from '../../../constants/routes';
import { roleLabel } from '../../../constants/roles';
import { useAdminUsers, useDeleteUser } from '../../../hooks/useIam';
import { useUserTableParams } from '../../../hooks/useUserTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';

export default function UserListPage() {
  const table = useUserTableParams();
  const { data, isLoading } = useAdminUsers(table.params);
  const remove = useDeleteUser();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });

  const columns = [
    { key: 'name', header: 'Nama', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Peran',
      sortable: true,
      render: (row) => roleLabel(row.role),
    },
    {
      key: 'units',
      header: 'Unit',
      render: (row) => (row.units || []).map((unit) => unit.name).join('; ') || '—',
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="flex gap-1">
          <Can I="update" a="User">
            <Link to={ROUTES.adminUserEdit(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Edit">
              <Icon icon="mdi:pencil-outline" className="size-4" />
            </Link>
          </Can>
          <Can I="delete" a="User">
            <button type="button" className="btn btn-ghost btn-square btn-sm" aria-label="Hapus" onClick={() => confirmDelete.open(row)}>
              <Icon icon="mdi:trash-can-outline" className="size-4" />
            </button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pengguna"
        subtitle="Kelola akun admin dan assignment unit."
        breadcrumbs={[{ label: 'Pengguna' }]}
        action={
          <Can I="create" a="User">
            <Link to={ROUTES.adminUserNew} className="btn btn-primary">
              Tambah pengguna
            </Link>
          </Can>
        }
      />
      <DataTable
        columns={columns}
        rows={data?.items || []}
        total={data?.total || 0}
        page={table.page}
        limit={table.limit}
        sortBy={table.sortBy}
        sortOrder={table.sortOrder}
        search={table.searchInput}
        isLoading={isLoading}
        emptyMessage="Belum ada pengguna"
        onSearchChange={table.setSearch}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSortChange={table.setSort}
        filters={
          <fieldset className="fieldset w-48 p-0">
            <legend className="fieldset-legend">Peran</legend>
            <select className="select" value={table.role} onChange={(event) => table.setRole(event.target.value)}>
              <option value="">Semua</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin_unit">Admin unit</option>
            </select>
          </fieldset>
        }
      />
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus pengguna"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.name}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
