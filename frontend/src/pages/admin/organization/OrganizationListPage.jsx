import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DataTable } from '../../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { MediaLibraryModal } from '../../../components/common/MediaLibraryModal';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { Icon } from '../../../components/ui/Icon';
import { organizationFormSchema } from '../../../validations/cms.schema';
import { useAdminOrganization, useCreateOrganizationMember, useDeleteOrganizationMember } from '../../../hooks/useCms';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { payloadUnitId, unitScopeName } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

export default function OrganizationListPage() {
  const user = useAuthStore((s) => s.user);
  const table = useCmsTableParams();
  const { data, isLoading } = useAdminOrganization({ ...table.params, sortBy: 'order', sortOrder: 'asc' });
  const createItem = useCreateOrganizationMember();
  const remove = useDeleteOrganizationMember();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });
  const [mediaOpen, setMediaOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: { name: '', title: '', unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id, parentId: '', order: 0, photoMediaId: '' },
  });

  const columns = [
    { key: 'name', header: 'Nama', sortable: true },
    { key: 'title', header: 'Jabatan', sortable: true },
    { key: 'unit', header: 'Unit', render: (row) => unitScopeName(row.unit) },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => confirmDelete.open(row)} aria-label="Hapus">
          <Icon icon="mdi:trash-can-outline" className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Struktur organisasi" subtitle="Pejabat dan staf per unit." breadcrumbs={[{ label: 'Struktur organisasi' }]} />
      <form
        className="card mb-6 bg-base-100 shadow-sm"
        onSubmit={handleSubmit(async (values) => {
          await createItem.mutateAsync({
            ...values,
            unitId: payloadUnitId(values.unitId),
            parentId: values.parentId || null,
            photoMediaId: values.photoMediaId || null,
          });
          reset({ name: '', title: '', unitId: values.unitId, parentId: '', order: 0, photoMediaId: '' });
          setPhotoUrl('');
        })}
      >
        <div className="card-body grid gap-2 md:grid-cols-2">
          <AdminField label="Unit">
            <UnitSelect value={watch('unitId')} onChange={(value) => setValue('unitId', value)} />
          </AdminField>
          <AdminField label="Atasan">
            <select className="select w-full" {...register('parentId')}>
              <option value="">Tanpa atasan</option>
              {(data?.items || []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Nama" error={errors.name?.message}>
            <input className="input w-full" {...register('name')} />
          </AdminField>
          <AdminField label="Jabatan" error={errors.title?.message}>
            <input className="input w-full" {...register('title')} />
          </AdminField>
          <AdminField label="Foto">
            <div className="flex items-center gap-3">
              {photoUrl ? <img src={photoUrl} alt="" className="h-12 w-12 rounded-md object-cover" /> : null}
              <button type="button" className="btn btn-sm" onClick={() => setMediaOpen(true)}>
                Pilih foto
              </button>
            </div>
          </AdminField>
          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={createItem.isPending}>
              Tambah anggota
            </button>
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
        emptyMessage="Belum ada anggota"
        onSearchChange={table.setSearch}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        onSortChange={table.setSort}
      />
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus anggota"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.name}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
      <MediaLibraryModal
        open={mediaOpen}
        unitId={watch('unitId')}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => {
          setValue('photoMediaId', media.id);
          setPhotoUrl(media.url);
        }}
      />
    </div>
  );
}
