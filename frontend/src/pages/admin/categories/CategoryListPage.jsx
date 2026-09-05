import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { Icon } from '../../../components/ui/Icon';
import { categoryFormSchema } from '../../../validations/cms.schema';
import { useAdminCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCms';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { slugify } from '../../../utils/slugify';
import { payloadUnitId, unitScopeName } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

export default function CategoryListPage() {
  const user = useAuthStore((s) => s.user);
  const table = useCmsTableParams();
  const { data, isLoading } = useAdminCategories(table.params);
  const createItem = useCreateCategory();
  const updateItem = useUpdateCategory();
  const remove = useDeleteCategory();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '', slug: '', unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id },
  });

  function startEdit(row) {
    setEditingId(row.id);
    reset({ name: row.name, slug: row.slug, unitId: row.unitId ?? '' });
  }

  function cancelEdit() {
    setEditingId(null);
    reset({ name: '', slug: '', unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id });
  }

  const columns = [
    { key: 'name', header: 'Nama', sortable: true },
    { key: 'slug', header: 'Slug', sortable: true },
    { key: 'unit', header: 'Unit', render: (row) => unitScopeName(row.unit) },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="flex gap-1">
          <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => startEdit(row)} aria-label="Edit">
            <Icon icon="mdi:pencil-outline" className="size-4" />
          </button>
          <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => confirmDelete.open(row)} aria-label="Hapus">
            <Icon icon="mdi:trash-can-outline" className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Kategori" subtitle="Kategori konten per unit. Dipakai filter arsip dan umpan." breadcrumbs={[{ label: 'Kategori' }]} />
      <form
        className="card mb-6 bg-base-100 shadow-sm"
        onSubmit={handleSubmit(async (values) => {
          const payload = { ...values, unitId: payloadUnitId(values.unitId) };
          if (editingId) await updateItem.mutateAsync({ id: editingId, payload });
          else await createItem.mutateAsync(payload);
          cancelEdit();
        })}
      >
        <div className="card-body grid gap-2 md:grid-cols-3">
          <AdminField label="Unit">
            <UnitSelect value={watch('unitId')} onChange={(value) => setValue('unitId', value)} />
          </AdminField>
          <AdminField label="Nama" error={errors.name?.message}>
            <input
              className="input w-full"
              {...register('name', { onChange: (event) => setValue('slug', slugify(event.target.value)) })}
            />
          </AdminField>
          <AdminField label="Slug" error={errors.slug?.message}>
            <input className="input w-full" {...register('slug')} />
          </AdminField>
          <div className="flex gap-2 md:col-span-3">
            <button type="submit" className="btn btn-primary btn-sm" disabled={createItem.isPending || updateItem.isPending}>
              {editingId ? 'Simpan kategori' : 'Tambah kategori'}
            </button>
            {editingId ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                Batal
              </button>
            ) : null}
          </div>
        </div>
      </form>
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
        emptyMessage="Belum ada kategori"
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
        title="Hapus kategori"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.name}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
