import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminField } from '../../../components/admin/AdminField';
import { PageHeader } from '../../../components/admin/PageHeader';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { pageFormSchema } from '../../../validations/cms.schema';
import { SeoFields } from '../../../components/admin/SeoFields';
import { useAdminPage, useCreatePage, useUpdatePage } from '../../../hooks/useCms';
import { ROUTES } from '../../../constants/routes';
import { slugify } from '../../../utils/slugify';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { withPreviewQuery } from '../../../helpers/previewHref';
import { useAuthStore } from '../../../store/auth.store';

export default function PageFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const query = useAdminPage(id);
  const createItem = useCreatePage();
  const updateItem = useUpdatePage();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  useEffect(() => {
    if (!query.data) return;
    reset({
      title: query.data.title,
      slug: query.data.slug,
      content: query.data.content || '',
      status: query.data.status,
      unitId: query.data.unitId,
      metaTitle: query.data.metaTitle || '',
      metaDescription: query.data.metaDescription || '',
      metaKeywords: query.data.metaKeywords || '',
    });
  }, [query.data, reset]);

  function toPayload(values) {
    return {
      ...values,
      unitId: payloadUnitId(values.unitId),
      metaTitle: values.metaTitle || null,
      metaDescription: values.metaDescription || null,
      metaKeywords: values.metaKeywords || null,
    };
  }

  async function onSubmit(values) {
    const payload = toPayload(values);
    if (isEdit) await updateItem.mutateAsync({ id, payload });
    else await createItem.mutateAsync(payload);
    navigate(ROUTES.adminPages);
  }

  async function saveAndOpenEditor(values) {
    const payload = toPayload(values);
    if (isEdit) {
      await updateItem.mutateAsync({ id, payload });
      navigate(ROUTES.adminPageBuilder(id));
      return;
    }
    const result = await createItem.mutateAsync(payload);
    const created = result?.data?.page;
    if (created?.id) navigate(ROUTES.adminPageBuilder(created.id));
    else navigate(ROUTES.adminPageNewBuilder);
  }

  if (isEdit && query.isLoading) return <div className="skeleton h-64 w-full" />;

  return (
    <div className="w-full">
      <PageHeader
        title={isEdit ? 'Edit halaman' : 'Tambah halaman'}
        subtitle="Atur judul, slug, dan SEO. Isi visual dibuka di editor penuh."
        breadcrumbs={[{ label: 'Halaman', path: ROUTES.adminPages }, { label: isEdit ? 'Edit' : 'Tambah' }]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <div className="grid gap-2 md:grid-cols-2">
            <AdminField label="Unit" error={errors.unitId?.message}>
              <UnitSelect value={watch('unitId')} onChange={(value) => setValue('unitId', value)} />
            </AdminField>
            <AdminField label="Status">
              <select className="select w-full" {...register('status')}>
                <option value="draft">Draf</option>
                <option value="published">Terbit</option>
              </select>
            </AdminField>
          </div>
          <AdminField label="Judul" error={errors.title?.message}>
            <input
              className="input w-full"
              {...register('title', {
                onChange: (event) => {
                  if (!isEdit) setValue('slug', slugify(event.target.value));
                },
              })}
            />
          </AdminField>
          <AdminField label="Slug" error={errors.slug?.message}>
            <input className="input w-full" {...register('slug')} />
          </AdminField>
          <SeoFields register={register} errors={errors} />
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={createItem.isPending || updateItem.isPending}>
              Simpan
            </button>
            <button
              type="button"
              className="btn btn-primary btn-outline"
              disabled={createItem.isPending || updateItem.isPending}
              onClick={handleSubmit(saveAndOpenEditor)}
            >
              Buka editor
            </button>
            {isEdit ? (
              <a className="btn btn-ghost" href={withPreviewQuery(ROUTES.adminPagePreview(id))} target="_blank" rel="noreferrer">
                Pratinjau
              </a>
            ) : null}
            {isEdit && query.data?.status === 'published' ? (
              <a className="btn btn-ghost" href={ROUTES.unitPage(query.data.unit?.slug || '', query.data.slug)} target="_blank" rel="noreferrer">
                Lihat di situs
              </a>
            ) : null}
            <button type="button" className="btn btn-ghost" onClick={() => navigate(ROUTES.adminPages)}>
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
