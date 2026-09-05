import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminField } from '../../../components/admin/AdminField';
import { PageHeader } from '../../../components/admin/PageHeader';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { RichTextEditor } from '../../../components/common/RichTextEditor';
import { MediaLibraryModal } from '../../../components/common/MediaLibraryModal';
import { postFormSchema } from '../../../validations/cms.schema';
import { SeoFields } from '../../../components/admin/SeoFields';
import { useAdminCategories, useAdminPost, useCreatePost, useUpdatePost } from '../../../hooks/useCms';
import { ROUTES } from '../../../constants/routes';
import { slugify } from '../../../utils/slugify';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

export default function PostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const query = useAdminPost(id);
  const createItem = useCreatePost();
  const updateItem = useUpdatePost();
  const { data: categories } = useAdminCategories({ limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState('content');
  const [pickedCoverUrl, setPickedCoverUrl] = useState('');
  const insertImage = useRef(null);
  const coverUrl = pickedCoverUrl || query.data?.cover?.url || '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      isFeatured: false,
      categoryId: '',
      coverMediaId: '',
      unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  useEffect(() => {
    if (query.data) {
      reset({
        title: query.data.title,
        slug: query.data.slug,
        excerpt: query.data.excerpt || '',
        content: query.data.content || '',
        status: query.data.status,
        isFeatured: Boolean(query.data.isFeatured),
        categoryId: query.data.categoryId || '',
        coverMediaId: query.data.coverMediaId || '',
        unitId: query.data.unitId,
        metaTitle: query.data.metaTitle || '',
        metaDescription: query.data.metaDescription || '',
        metaKeywords: query.data.metaKeywords || '',
      });
    }
  }, [query.data, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      unitId: payloadUnitId(values.unitId),
      categoryId: values.categoryId || null,
      coverMediaId: values.coverMediaId || null,
      excerpt: values.excerpt || null,
      metaTitle: values.metaTitle || null,
      metaDescription: values.metaDescription || null,
      metaKeywords: values.metaKeywords || null,
    };
    if (isEdit) await updateItem.mutateAsync({ id, payload });
    else await createItem.mutateAsync(payload);
    navigate(ROUTES.adminPosts);
  }

  if (isEdit && query.isLoading) return <div className="skeleton h-64 w-full" />;

  return (
    <div className="w-full">
      <PageHeader
        title={isEdit ? 'Edit konten' : 'Tambah konten'}
        breadcrumbs={[{ label: 'Artikel', path: ROUTES.adminPosts }, { label: isEdit ? 'Edit' : 'Tambah' }]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <AdminField label="Unit">
            <UnitSelect value={watch('unitId')} onChange={(value) => setValue('unitId', value)} />
          </AdminField>
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
          <AdminField label="Kategori" error={errors.categoryId?.message}>
            <select className="select w-full" {...register('categoryId')}>
              <option value="">Pilih kategori</option>
              {(categories?.items || []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Ringkasan">
            <textarea className="textarea w-full" rows={2} {...register('excerpt')} />
          </AdminField>
          <AdminField label="Konten">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onRequestImage={(insert) => {
                    insertImage.current = insert;
                    setMediaMode('content');
                    setMediaOpen(true);
                  }}
                />
              )}
            />
          </AdminField>
          <AdminField label="Gambar sampul">
            <div className="flex items-center gap-3">
              {coverUrl ? <img src={coverUrl} alt="" className="h-16 w-24 rounded-md object-cover" /> : null}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setMediaMode('cover');
                  setMediaOpen(true);
                }}
              >
                Pilih gambar
              </button>
            </div>
          </AdminField>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('isFeatured')} />
            Tampilkan di hero beranda
          </label>
          <AdminField label="Status">
            <select className="select w-full" {...register('status')}>
              <option value="draft">Draf</option>
              <option value="published">Terbit</option>
            </select>
          </AdminField>
          <SeoFields register={register} errors={errors} />
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={createItem.isPending || updateItem.isPending}>
              Simpan
            </button>
            {isEdit && query.data?.status === 'published' ? (
              <a className="btn btn-ghost" href={ROUTES.unitPost(query.data.unit?.slug || '', query.data.slug)} target="_blank" rel="noreferrer">
                Lihat di situs
              </a>
            ) : null}
            <button type="button" className="btn btn-ghost" onClick={() => navigate(ROUTES.adminPosts)}>
              Batal
            </button>
          </div>
        </div>
      </form>
      <MediaLibraryModal
        open={mediaOpen}
        unitId={watch('unitId')}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => {
          if (mediaMode === 'cover') {
            setValue('coverMediaId', media.id);
            setPickedCoverUrl(media.url);
          } else {
            insertImage.current?.({ src: media.url, alt: media.altText || '' });
          }
        }}
      />
    </div>
  );
}
