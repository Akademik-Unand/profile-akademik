import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Icon } from '../../../components/ui/Icon';
import { useAdminPosts, useAdminCategories, useDeletePost } from '../../../hooks/useCms';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { ROUTES } from '../../../constants/routes';
import { Can } from '../../../policies/AbilityContext';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { unitScopeName } from '../../../helpers/cmsDisplay';
import { PERIODS, PERIOD_LABELS } from '../../../helpers/periodFilter';

export default function PostListPage() {
  const table = useCmsTableParams();
  const { data, isLoading } = useAdminPosts(table.params);
  const { data: categories } = useAdminCategories({ limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const remove = useDeletePost();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });

  const columns = [
    { key: 'title', header: 'Judul', sortable: true },
    { key: 'category', header: 'Kategori', render: (row) => row.category?.name || '—' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`badge badge-sm ${row.status === 'published' ? 'badge-success' : 'badge-ghost'}`}>{row.status}</span>,
    },
    { key: 'isFeatured', header: 'Unggulan', render: (row) => (row.isFeatured ? 'Ya' : '—') },
    { key: 'unit', header: 'Unit', render: (row) => unitScopeName(row.unit) },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={ROUTES.adminPostEdit(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Edit">
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
        title="Pengumuman"
        subtitle="Berita dan pengumuman unit."
        breadcrumbs={[{ label: 'Pengumuman' }]}
        action={
          <Can I="create" a="Post">
            <Link to={ROUTES.adminPostNew} className="btn btn-primary">
              Tambah pengumuman
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
        emptyMessage="Belum ada pengumuman"
        onSearchChange={table.setSearch}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSortChange={table.setSort}
        filters={
          <>
            <fieldset className="fieldset w-40 p-0">
              <legend className="fieldset-legend">Status</legend>
              <select className="select" value={table.status} onChange={(event) => table.setStatus(event.target.value)}>
                <option value="">Semua</option>
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>
            </fieldset>
            <fieldset className="fieldset w-44 p-0">
              <legend className="fieldset-legend">Periode</legend>
              <select className="select" value={table.period} onChange={(event) => table.setPeriod(event.target.value)}>
                <option value="">Semua</option>
                {PERIODS.filter((value) => value !== 'all').map((value) => (
                  <option key={value} value={value}>
                    {PERIOD_LABELS[value]}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset w-48 p-0">
              <legend className="fieldset-legend">Kategori</legend>
              <select className="select" value={table.categoryId} onChange={(event) => table.setCategoryId(event.target.value)}>
                <option value="">Semua</option>
                {(categories?.items || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset w-48 p-0">
              <legend className="fieldset-legend">Unit</legend>
              <UnitSelect value={table.unitId} onChange={(value) => table.setUnitId(value)} variant="filter" />
            </fieldset>
          </>
        }
      />
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus pengumuman"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.title}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
