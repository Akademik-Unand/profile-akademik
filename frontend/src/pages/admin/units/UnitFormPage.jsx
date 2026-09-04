import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminField } from '../../../components/admin/AdminField';
import { unitFormSchema } from '../../../validations/unit.schema';
import { useAdminUnit, useCreateUnit, useUpdateUnit } from '../../../hooks/useUnits';
import { ROUTES } from '../../../constants/routes';
import { PageHeader } from '../../../components/admin/PageHeader';
import { MediaLibraryModal } from '../../../components/common/MediaLibraryModal';
import { SeoFields } from '../../../components/admin/SeoFields';

export default function UnitFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const unitQuery = useAdminUnit(id);
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('logo');
  const [pickedLogoUrl, setPickedLogoUrl] = useState('');
  const [pickedCoverUrl, setPickedCoverUrl] = useState('');
  const logoUrl = pickedLogoUrl || unitQuery.data?.logo?.url || '';
  const coverUrl = pickedCoverUrl || unitQuery.data?.cover?.url || '';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      themeColor: '#108652',
      templateKey: 'classic',
      logoMediaId: '',
      coverMediaId: '',
      address: '',
      phone: '',
      fax: '',
      email: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
      linkedinUrl: '',
      description: '',
      isActive: true,
      isDefault: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    },
  });

  useEffect(() => {
    if (unitQuery.data) {
      reset({
        name: unitQuery.data.name,
        slug: unitQuery.data.slug,
        themeColor: unitQuery.data.themeColor || '#108652',
        templateKey: unitQuery.data.templateKey || '',
        logoMediaId: unitQuery.data.logoMediaId || '',
        coverMediaId: unitQuery.data.coverMediaId || '',
        address: unitQuery.data.address || '',
        phone: unitQuery.data.phone || '',
        fax: unitQuery.data.fax || '',
        email: unitQuery.data.email || '',
        facebookUrl: unitQuery.data.facebookUrl || '',
        instagramUrl: unitQuery.data.instagramUrl || '',
        twitterUrl: unitQuery.data.twitterUrl || '',
        youtubeUrl: unitQuery.data.youtubeUrl || '',
        tiktokUrl: unitQuery.data.tiktokUrl || '',
        linkedinUrl: unitQuery.data.linkedinUrl || '',
        description: unitQuery.data.description || '',
        isActive: unitQuery.data.isActive,
        isDefault: unitQuery.data.isDefault,
        seoTitle: unitQuery.data.seoTitle || '',
        seoDescription: unitQuery.data.seoDescription || '',
        seoKeywords: unitQuery.data.seoKeywords || '',
      });
    }
  }, [unitQuery.data, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      themeColor: values.themeColor || null,
      templateKey: values.templateKey || null,
      logoMediaId: values.logoMediaId || null,
      coverMediaId: values.coverMediaId || null,
      address: values.address || null,
      phone: values.phone || null,
      fax: values.fax || null,
      email: values.email || null,
      facebookUrl: values.facebookUrl || null,
      instagramUrl: values.instagramUrl || null,
      twitterUrl: values.twitterUrl || null,
      youtubeUrl: values.youtubeUrl || null,
      tiktokUrl: values.tiktokUrl || null,
      linkedinUrl: values.linkedinUrl || null,
      description: values.description || null,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      seoKeywords: values.seoKeywords || null,
    };
    if (isEdit) await updateUnit.mutateAsync({ id, payload });
    else await createUnit.mutateAsync(payload);
    navigate(ROUTES.adminUnits);
  }

  if (isEdit && unitQuery.isLoading) {
    return (
      <div className="w-full">
        <div className="skeleton h-7 w-40" />
        <div className="skeleton mt-6 h-64 w-full" />
      </div>
    );
  }

  const submitting = createUnit.isPending || updateUnit.isPending;

  return (
    <div className="w-full">
      <PageHeader
        title={isEdit ? 'Edit unit' : 'Tambah unit'}
        breadcrumbs={[
          { label: 'Unit', path: ROUTES.adminUnits },
          { label: isEdit ? 'Edit' : 'Tambah' },
        ]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <AdminField label="Nama" error={errors.name?.message}>
            <input className="input w-full" {...register('name')} />
          </AdminField>
          <AdminField label="Slug" error={errors.slug?.message}>
            <input className="input w-full" {...register('slug')} />
          </AdminField>
          <AdminField label="Logo">
            <div className="flex items-center gap-3">
              {logoUrl ? <img src={logoUrl} alt="" className="h-12 w-12 object-contain" /> : null}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setMediaTarget('logo');
                  setMediaOpen(true);
                }}
              >
                Pilih logo
              </button>
            </div>
          </AdminField>
          <AdminField label="Gambar sampul">
            <p className="mb-2 text-xs text-base-content/60">Foto kartu unit di beranda. Boleh dikosongkan.</p>
            <div className="flex items-center gap-3">
              {coverUrl ? <img src={coverUrl} alt="" className="h-16 w-28 rounded-md object-cover" /> : null}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setMediaTarget('cover');
                  setMediaOpen(true);
                }}
              >
                Pilih gambar
              </button>
            </div>
          </AdminField>
          <AdminField label="Alamat">
            <textarea className="textarea w-full" rows={3} {...register('address')} />
          </AdminField>
          <AdminField label="Telepon">
            <input className="input w-full" {...register('phone')} />
          </AdminField>
          <AdminField label="Faks">
            <input className="input w-full" {...register('fax')} />
          </AdminField>
          <AdminField label="Email" error={errors.email?.message}>
            <input className="input w-full" {...register('email')} />
          </AdminField>
          <AdminField label="Instagram" error={errors.instagramUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('instagramUrl')} />
          </AdminField>
          <AdminField label="Facebook" error={errors.facebookUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('facebookUrl')} />
          </AdminField>
          <AdminField label="X / Twitter" error={errors.twitterUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('twitterUrl')} />
          </AdminField>
          <AdminField label="YouTube" error={errors.youtubeUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('youtubeUrl')} />
          </AdminField>
          <AdminField label="TikTok" error={errors.tiktokUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('tiktokUrl')} />
          </AdminField>
          <AdminField label="LinkedIn" error={errors.linkedinUrl?.message}>
            <input className="input w-full" placeholder="https://" {...register('linkedinUrl')} />
          </AdminField>
          <AdminField label="Deskripsi">
            <textarea className="textarea w-full" rows={3} {...register('description')} />
          </AdminField>
          <AdminField label="Warna tema" error={errors.themeColor?.message}>
            <input type="color" className="input h-10 w-full" {...register('themeColor')} />
          </AdminField>
          <AdminField label="Template" error={errors.templateKey?.message}>
            <input className="input w-full" {...register('templateKey')} />
          </AdminField>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('isActive')} />
            Aktif
          </label>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('isDefault')} />
            Jadikan unit default (beranda)
          </label>
          <SeoFields register={register} errors={errors} names={{ title: 'seoTitle', description: 'seoDescription', keywords: 'seoKeywords' }} />
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : null}
              Simpan
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(ROUTES.adminUnits)}>
              Batal
            </button>
          </div>
        </div>
      </form>
      <MediaLibraryModal
        open={mediaOpen}
        unitId={isEdit ? Number(id) : undefined}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => {
          if (mediaTarget === 'cover') {
            setValue('coverMediaId', media.id);
            setPickedCoverUrl(media.url);
            return;
          }
          setValue('logoMediaId', media.id);
          setPickedLogoUrl(media.url);
        }}
      />
    </div>
  );
}
