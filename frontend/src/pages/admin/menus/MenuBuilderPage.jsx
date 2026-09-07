import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { MenuLocationSection } from '../../../components/admin/MenuLocationSection';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { menuFormSchema } from '../../../validations/cms.schema';
import { menusByLocation } from '../../../helpers/menuTree';
import {
  useAdminCategories,
  useAdminMenus,
  useAdminPages,
  useCreateMenu,
  useDeleteMenu,
  useReorderMenus,
  useUpdateMenu,
} from '../../../hooks/useCms';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { useAdminUnits } from '../../../hooks/useUnits';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

const EMPTY_FORM = {
  label: '',
  type: 'external_url',
  externalUrl: '/',
  location: 'header',
  order: 0,
  unitId: '',
  parentId: '',
  targetPageId: '',
  targetCategoryId: '',
  targetContentTypeId: '',
};

function scopeQuery(unitId) {
  if (unitId === '' || unitId === null || unitId === undefined) return { site: 'main' };
  return { unitId: Number(unitId) };
}

function toFormValues(item, scopeUnitId) {
  return {
    label: item.label || '',
    type: item.type || 'external_url',
    externalUrl: item.externalUrl || (item.type === 'archive' ? 'posts' : '/'),
    location: item.location || 'header',
    order: item.order ?? 0,
    unitId: scopeUnitId,
    parentId: item.parentId || '',
    targetPageId: item.targetPageId || '',
    targetCategoryId: item.targetCategoryId || '',
    targetContentTypeId: item.targetContentTypeId || '',
  };
}

function toPayload(values, scopeUnitId, order) {
  return {
    label: values.label,
    type: values.type,
    location: values.location,
    unitId: payloadUnitId(scopeUnitId),
    parentId: values.parentId || null,
    targetPageId: values.targetPageId || null,
    targetCategoryId: values.targetCategoryId || null,
    targetContentTypeId: values.targetContentTypeId || null,
    externalUrl: values.externalUrl || null,
    order,
  };
}

export default function MenuBuilderPage() {
  const user = useAuthStore((s) => s.user);
  const isSuper = user?.role === 'superadmin';
  const [unitId, setUnitId] = useState(isSuper ? '' : user?.units?.[0]?.id || '');
  const [editing, setEditing] = useState(null);
  const queryParams = useMemo(() => scopeQuery(unitId), [unitId]);
  const unitsQuery = useAdminUnits({ limit: 100, sortBy: 'name', sortOrder: 'asc' }, { enabled: isSuper });
  const units = isSuper ? unitsQuery.data?.items || [] : user?.units || [];
  const activeScopeName =
    unitId === '' || unitId === null || unitId === undefined
      ? 'Situs utama'
      : units.find((item) => String(item.id) === String(unitId))?.name || 'Unit';
  const { data, isLoading } = useAdminMenus(queryParams);
  const { data: pages } = useAdminPages({ limit: 100, ...queryParams });
  const { data: categories } = useAdminCategories({ limit: 100, ...queryParams });
  const { data: contentTypes } = useContentTypes({ limit: 100, ...queryParams });
  const createItem = useCreateMenu();
  const updateItem = useUpdateMenu();
  const reorder = useReorderMenus();
  const remove = useDeleteMenu();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });
  const items = data?.items || [];
  const headerTree = useMemo(() => menusByLocation(items, 'header'), [items]);
  const footerTree = useMemo(() => menusByLocation(items, 'footer'), [items]);
  const saving = createItem.isPending || updateItem.isPending;

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
      ...EMPTY_FORM,
      unitId: isSuper ? '' : user?.units?.[0]?.id || '',
    },
  });

  const type = watch('type');
  const location = watch('location');
  const parentOptions = items.filter(
    (item) => item.location === location && (!editing || item.id !== editing.id),
  );

  function clearForm(nextUnitId = unitId, nextLocation = 'header') {
    setEditing(null);
    reset({
      ...EMPTY_FORM,
      unitId: nextUnitId,
      location: nextLocation,
      externalUrl: '/',
    });
  }

  useEffect(() => {
    setEditing(null);
    reset({
      ...EMPTY_FORM,
      unitId,
      externalUrl: '/',
    });
  }, [unitId, reset]);

  function startEdit(item) {
    setEditing(item);
    reset(toFormValues(item, unitId));
  }

  function handleUnitChange(value) {
    setUnitId(value === 'main' ? '' : value);
  }

  async function onSubmit(values) {
    const siblings = items.filter(
      (item) =>
        item.location === values.location &&
        String(item.parentId || '') === String(values.parentId || '') &&
        (!editing || item.id !== editing.id),
    );
    const payload = toPayload(values, unitId, editing ? editing.order ?? 0 : siblings.length);
    if (editing) {
      await updateItem.mutateAsync({ id: editing.id, payload });
    } else {
      await createItem.mutateAsync(payload);
    }
    clearForm(unitId, values.location);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-8">
        <PageHeader
          title="Menu"
          subtitle={`Navbar dan footer terpisah untuk ${activeScopeName}.`}
          breadcrumbs={[{ label: 'Menu' }]}
          action={
            isSuper ? (
              <div className="w-48">
                <UnitSelect value={unitId} onChange={handleUnitChange} />
              </div>
            ) : null
          }
        />
        {isLoading ? <div className="skeleton h-40" /> : null}
        {!isLoading ? (
          <>
            <MenuLocationSection
              title="Navbar"
              hint="Menu di bagian atas situs."
              tree={headerTree}
              editingId={editing?.id}
              onEdit={startEdit}
              onDelete={confirmDelete.open}
              onReorder={(payload) => reorder.mutate(payload)}
              onAdd={() => clearForm(unitId, 'header')}
            />
            <MenuLocationSection
              title="Footer"
              hint="Menu di bagian bawah situs."
              tree={footerTree}
              editingId={editing?.id}
              onEdit={startEdit}
              onDelete={confirmDelete.open}
              onReorder={(payload) => reorder.mutate(payload)}
              onAdd={() => clearForm(unitId, 'footer')}
            />
          </>
        ) : null}
      </div>
      <form className="card h-fit bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="card-title text-sm font-medium">
              {editing ? `Edit item · ${activeScopeName}` : `Tambah item · ${activeScopeName}`}
            </h2>
            {editing ? (
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => clearForm(unitId, location)}>
                Batal
              </button>
            ) : null}
          </div>
          <AdminField label="Lokasi">
            <select className="select w-full" {...register('location')}>
              <option value="header">Navbar</option>
              <option value="footer">Footer</option>
            </select>
          </AdminField>
          <AdminField label="Induk">
            <select className="select w-full" {...register('parentId')}>
              <option value="">Tanpa induk (menu utama)</option>
              {parentOptions.map((item) => (
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
          <div className="card-actions mt-1">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {editing ? 'Simpan perubahan' : 'Tambah'}
            </button>
          </div>
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
