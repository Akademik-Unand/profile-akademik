import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { Icon } from '../../../components/ui/Icon';
import { useAdminUnits, useDeleteUnit } from '../../../hooks/useUnits';
import { useUnitTableParams } from '../../../hooks/useUnitTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { ROUTES } from '../../../constants/routes';
import { PageHeader } from '../../../components/admin/PageHeader';

export default function UnitListPage() {
  const table = useUnitTableParams();
  const { data, isLoading } = useAdminUnits(table.params);
  const removeUnit = useDeleteUnit();
  const confirmDelete = useConfirmDelete({
    onConfirm: (unit) => removeUnit.mutateAsync(unit.id),
  });

  const columns = [
    { key: 'name', header: 'Nama', sortable: true },
    { key: 'slug', header: 'Slug', sortable: true },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`badge badge-sm ${row.isActive ? 'badge-success' : 'badge-ghost'}`}>
          {row.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'isDefault',
      header: 'Default',
      sortable: true,
      render: (row) => (row.isDefault ? <span className="badge badge-sm">Ya</span> : '—'),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link to={ROUTES.adminUnitEdit(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Edit">
            <Icon icon="mdi:pencil-outline" className="size-4" />
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Hapus"
            onClick={() => confirmDelete.open(row)}
          >
            <Icon icon="mdi:trash-can-outline" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Unit"
        subtitle="Kelola unit yang tampil di situs publik."
        breadcrumbs={[{ label: 'Unit' }]}
        action={
          <Link to={ROUTES.adminUnitNew} className="btn btn-primary">
            Tambah unit
          </Link>
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
        emptyMessage="Belum ada unit"
        onSearchChange={table.setSearch}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSortChange={table.setSort}
        filters={
          <fieldset className="fieldset w-40 p-0">
            <legend className="fieldset-legend">Status</legend>
            <select className="select" value={table.isActive} onChange={(event) => table.setIsActive(event.target.value)}>
              <option value="">Semua</option>
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </fieldset>
        }
      />

      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus unit"
        message={
          confirmDelete.target
            ? `Hapus unit “${confirmDelete.target.name}”? Unit default tidak dapat dihapus.`
            : undefined
        }
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
