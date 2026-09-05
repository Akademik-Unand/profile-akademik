import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Icon } from '../../../components/ui/Icon';
import { useAdminPages, useDeletePage } from '../../../hooks/useCms';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { ROUTES } from '../../../constants/routes';
import { isSystemPageSlug } from '../../../constants/systemPages';
import { Can } from '../../../policies/AbilityContext';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { unitScopeName } from '../../../helpers/cmsDisplay';
import { landingBuilderHref, landingPreviewHref, resolveLandingUnitId, systemPageDataHref, systemPageDataLabel } from '../../../helpers/pageListActions';
import { withPreviewQuery } from '../../../helpers/previewHref';
import { useAuthStore } from '../../../store/auth.store';

export default function PageListPage() {
  const user = useAuthStore((s) => s.user);
  const table = useCmsTableParams();
  const { data, isLoading } = useAdminPages(table.params);
  const remove = useDeletePage();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });
  const [berandaUnitId, setBerandaUnitId] = useState(() => resolveLandingUnitId(user, ''));
  const berandaHref = landingBuilderHref(berandaUnitId);

  const columns = [
    { key: 'title', header: 'Judul', sortable: true },
    { key: 'slug', header: 'Slug', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <span className={`badge badge-sm ${row.status === 'published' ? 'badge-success' : 'badge-ghost'}`}>{row.status}</span>,
    },
    { key: 'unit', header: 'Unit', render: (row) => unitScopeName(row.unit) },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => {
        const dataHref = systemPageDataHref(row.slug);
        return (
          <div className="flex gap-1">
            <Link to={ROUTES.adminPageBuilder(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Editor">
              <Icon icon="mdi:view-dashboard-edit-outline" className="size-4" />
            </Link>
            {dataHref ? (
              <Link to={dataHref} className="btn btn-ghost btn-square btn-sm" aria-label={systemPageDataLabel(row.slug)}>
                <Icon icon="mdi:database-outline" className="size-4" />
              </Link>
            ) : null}
            <Link to={ROUTES.adminPageEdit(row.id)} className="btn btn-ghost btn-square btn-sm" aria-label="Metadata">
              <Icon icon="mdi:pencil-outline" className="size-4" />
            </Link>
            {isSystemPageSlug(row.slug) ? null : (
              <button type="button" className="btn btn-ghost btn-square btn-sm" aria-label="Hapus" onClick={() => confirmDelete.open(row)}>
                <Icon icon="mdi:trash-can-outline" className="size-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Halaman"
        subtitle="Beranda, arsip, dan halaman bebas memakai editor yang sama."
        breadcrumbs={[{ label: 'Halaman' }]}
        action={
          <Can I="create" a="Page">
            <Link to={ROUTES.adminPageNew} className="btn btn-primary">
              Tambah halaman
            </Link>
          </Can>
        }
      />
      <div className="card mb-4 bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm">Beranda</p>
            <p className="text-xs text-base-content/60">Setiap unit punya kanvas sendiri. Pilih lingkup, lalu susun bloknya.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-52">
              <UnitSelect value={berandaUnitId} onChange={(value) => setBerandaUnitId(value === 'main' ? '' : value)} />
            </div>
            <Can I="read" a="Landing">
              <Link className="btn btn-primary btn-sm" to={berandaHref}>
                Buka editor
              </Link>
              <a className="btn btn-ghost btn-sm" href={withPreviewQuery(landingPreviewHref(berandaUnitId))} target="_blank" rel="noreferrer">
                Pratinjau
              </a>
            </Can>
          </div>
        </div>
      </div>
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
        emptyMessage="Belum ada halaman"
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
            <fieldset className="fieldset w-48 p-0">
              <legend className="fieldset-legend">Unit</legend>
              <UnitSelect value={table.unitId} onChange={(value) => table.setUnitId(value)} variant="filter" />
            </fieldset>
          </>
        }
      />
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus halaman"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.title}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
