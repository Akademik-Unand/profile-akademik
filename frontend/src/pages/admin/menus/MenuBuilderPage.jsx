import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { SortableList } from '../../../components/common/SortableList';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { Icon } from '../../../components/ui/Icon';
import { menuFormSchema } from '../../../validations/cms.schema';
import { flattenMenuTree } from '../../../helpers/menuTree';
import { useAdminCategories, useAdminMenus, useAdminPages, useCreateMenu, useDeleteMenu, useReorderMenus } from '../../../hooks/useCms';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { payloadUnitId, unitScopeName } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

export default function MenuBuilderPage() {
  const user = useAuthStore((s) => s.user);
  const unitId = user?.role === 'superadmin' ? undefined : user?.units?.[0]?.id;
  const { data, isLoading } = useAdminMenus({ unitId });
  const { data: pages } = useAdminPages({ limit: 100, unitId });
  const { data: categories } = useAdminCategories({ limit: 100, unitId });
  const createItem = useCreateMenu();
  const reorder = useReorderMenus();
  const remove = useDeleteMenu();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });
  const items = data?.items || [];
  const treeItems = flattenMenuTree(data?.tree || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      label: '',
      type: 'external_url',
      externalUrl: '/',
      location: 'header',
      order: items.length,
      unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id,
      parentId: '',
      targetPageId: '',
      targetCategoryId: '',
      targetContentTypeId: '',
    },
  });

  const type = watch('type');
  const location = watch('location');
  const selectedUnitId = payloadUnitId(watch('unitId'));
  const { data: contentTypes } = useContentTypes({ limit: 100, unitId: selectedUnitId ?? undefined, site: selectedUnitId === null ? 'main' : undefined });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <PageHeader title="Menu" subtitle="Navbar dan footer. Geser untuk menyusun urutan." breadcrumbs={[{ label: 'Menu' }]} />
        {isLoading ? <div className="skeleton h-40" /> : null}
        <SortableList
          items={treeItems}
          onReorder={(next) => reorder.mutate(next.map((item, index) => ({ id: item.id, parentId: item.parentId, order: index })))}
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-2" style={{ paddingLeft: `${(item.depth || 0) * 16}px` }}>
              <div>
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-base-content/50">
                  {item.location} · {item.type} · {unitScopeName(item.unit)}
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-square btn-xs" onClick={() => confirmDelete.open(item)} aria-label="Hapus">
                <Icon icon="mdi:trash-can-outline" className="size-4" />
              </button>
            </div>
          )}
        />
      </div>
      <form
        className="card bg-base-100 shadow-sm"
        onSubmit={handleSubmit(async (values) => {
          await createItem.mutateAsync({
            ...values,
            unitId: payloadUnitId(values.unitId),
            parentId: values.parentId || null,
            targetPageId: values.targetPageId || null,
            targetCategoryId: values.targetCategoryId || null,
            targetContentTypeId: values.targetContentTypeId || null,
            externalUrl: values.externalUrl || null,
            location: values.location,
            order: items.length,
          });
          reset({ ...values, label: '', externalUrl: '/', targetPageId: '', targetCategoryId: '', targetContentTypeId: '', parentId: '' });
        })}
      >
        <div className="card-body gap-2">
          <h2 className="card-title text-sm font-medium">Tambah item</h2>
          <AdminField label="Unit">
            <UnitSelect value={watch('unitId')} onChange={(value) => setValue('unitId', value)} />
          </AdminField>
          <AdminField label="Lokasi">
            <select className="select w-full" {...register('location')}>
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </AdminField>
          <AdminField label="Induk">
            <select className="select w-full" {...register('parentId')}>
              <option value="">Tanpa induk</option>
              {items
                .filter((item) => item.location === location)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
            </select>
          </AdminField>
          <AdminField label="Label" error={errors.label?.message}>
            <input className="input w-full" {...register('label')} />
          </AdminField>
          <AdminField label="Tipe">
            <select
              className="select w-full"
              {...register('type', {
                onChange: (event) => {
                  if (event.target.value === 'archive' && !['posts', 'organization', 'agenda'].includes(watch('externalUrl'))) {
                    setValue('externalUrl', 'posts');
                  }
                },
              })}
            >
              <option value="external_url">URL</option>
              <option value="page">Halaman</option>
              <option value="post_category">Kategori konten</option>
              <option value="archive">Arsip situs</option>
              <option value="dynamic_content">Dynamic Site Data</option>
            </select>
          </AdminField>
          {type === 'external_url' ? (
            <AdminField label="URL">
              <input className="input w-full" {...register('externalUrl')} />
            </AdminField>
          ) : null}
          {type === 'archive' ? (
            <AdminField label="Arsip">
              <select className="select w-full" {...register('externalUrl')}>
                <option value="posts">Konten / pengumuman</option>
                <option value="organization">Organisasi</option>
                <option value="agenda">Agenda</option>
              </select>
            </AdminField>
          ) : null}
          {type === 'dynamic_content' ? (
            <AdminField label="Jenis data" error={errors.targetContentTypeId?.message}>
              <select className="select w-full" {...register('targetContentTypeId')}>
                <option value="">Pilih</option>
                {(contentTypes?.items || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </AdminField>
          ) : null}
          {type === 'page' ? (
            <AdminField label="Halaman">
              <select className="select w-full" {...register('targetPageId')}>
                <option value="">Pilih</option>
                {(pages?.items || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </AdminField>
          ) : null}
          {type === 'post_category' ? (
            <AdminField label="Kategori">
              <select className="select w-full" {...register('targetCategoryId')}>
                <option value="">Pilih</option>
                {(categories?.items || []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </AdminField>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={createItem.isPending}>
            Tambah
          </button>
        </div>
      </form>
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus menu"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.label}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
