import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Icon } from '../../../components/ui/Icon';
import { useAdminAgendas, useDeleteAgenda } from '../../../hooks/useCms';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { ROUTES } from '../../../constants/routes';
import { Can } from '../../../policies/AbilityContext';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { unitScopeName } from '../../../helpers/cmsDisplay';

export default function AgendaListPage() {
  const table = useCmsTableParams();
  const { data, isLoading } = useAdminAgendas({ ...table.params, sortBy: table.sortBy === 'createdAt' ? 'startsAt' : table.sortBy });
  const remove = useDeleteAgenda();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });

  const columns = [
    { key: 'title', header: 'Judul', sortable: true },
    {
      key: 'startsAt',
      header: 'Mulai',
      sortable: true,
      render: (row) => (row.startsAt ? new Date(row.startsAt).toLocaleDateString('id-ID') : '—'),
    },
    { key: 'location', header: 'Lokasi' },
    { key: 'status',
      header: 'Status',
      render: (row) => <span className={`badge badge-sm ${row.status === 'published' ? 'badge-success' : 'badge-ghost'}`}>{row.status}</span>,
    },
    { key: 'unit', header: 'Unit', render: (row) => unitScopeName(row.unit) },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={ROUTES.adminAgendaEdit(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Edit">
            <Icon icon="mdi:pencil-outline" className="size-4" />
          </Link>
          <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => confirmDelete.open(row)} aria-label="Hapus">
            <Icon icon="mdi:trash-can-outline" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Item agenda"
        subtitle="Data tanggal yang ditampilkan blok Arsip agenda di halaman arsip."
        breadcrumbs={[{ label: 'Halaman', path: ROUTES.adminPages }, { label: 'Item agenda' }]}
        action={
          <Can I="create" a="Agenda">
            <Link to={ROUTES.adminAgendaNew} className="btn btn-primary">
              Tambah agenda
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
        emptyMessage="Belum ada agenda"
        onSearchChange={table.setSearch}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSortChange={table.setSort}
        filters={
          <fieldset className="fieldset w-48 p-0">
            <legend className="fieldset-legend">Unit</legend>
            <UnitSelect value={table.unitId} onChange={(value) => table.setUnitId(value)} variant="filter" />
          </fieldset>
        }
      />
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus agenda"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.title}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
