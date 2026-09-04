import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminField } from '../../../components/admin/AdminField';
import { PageHeader } from '../../../components/admin/PageHeader';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { agendaFormSchema } from '../../../validations/cms.schema';
import { useAdminAgenda, useCreateAgenda, useUpdateAgenda } from '../../../hooks/useCms';
import { ROUTES } from '../../../constants/routes';
import { slugify } from '../../../utils/slugify';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { useAuthStore } from '../../../store/auth.store';

function toInputDate(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export default function AgendaFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const query = useAdminAgenda(id);
  const createItem = useCreateAgenda();
  const updateItem = useUpdateAgenda();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agendaFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      startsAt: '',
      endsAt: '',
      timeText: '',
      location: '',
      description: '',
      status: 'draft',
      unitId: user?.role === 'superadmin' ? '' : user?.units?.[0]?.id,
    },
  });

  useEffect(() => {
    if (query.data) {
      reset({
        title: query.data.title,
        slug: query.data.slug,
        startsAt: toInputDate(query.data.startsAt),
        endsAt: toInputDate(query.data.endsAt),
        timeText: query.data.timeText || '',
        location: query.data.location || '',
        description: query.data.description || '',
        status: query.data.status,
        unitId: query.data.unitId,
      });
    }
  }, [query.data, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      unitId: payloadUnitId(values.unitId),
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      timeText: values.timeText || null,
      location: values.location || null,
      description: values.description || null,
    };
    if (isEdit) await updateItem.mutateAsync({ id, payload });
    else await createItem.mutateAsync(payload);
    navigate(ROUTES.adminAgendas);
  }

  if (isEdit && query.isLoading) return <div className="skeleton h-64 w-full" />;

  return (
    <div className="w-full">
      <PageHeader
        title={isEdit ? 'Edit agenda' : 'Tambah agenda'}
        breadcrumbs={[{ label: 'Agenda', path: ROUTES.adminAgendas }, { label: isEdit ? 'Edit' : 'Tambah' }]}
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
          <AdminField label="Mulai" error={errors.startsAt?.message}>
            <input type="date" className="input w-full" {...register('startsAt')} />
          </AdminField>
          <AdminField label="Selesai">
            <input type="date" className="input w-full" {...register('endsAt')} />
          </AdminField>
          <AdminField label="Waktu">
            <input className="input w-full" placeholder="Pukul 08.00 - selesai" {...register('timeText')} />
          </AdminField>
          <AdminField label="Lokasi">
            <input className="input w-full" {...register('location')} />
          </AdminField>
          <AdminField label="Deskripsi">
            <textarea className="textarea w-full" rows={3} {...register('description')} />
          </AdminField>
          <AdminField label="Status">
            <select className="select w-full" {...register('status')}>
              <option value="draft">Draf</option>
              <option value="published">Terbit</option>
            </select>
          </AdminField>
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={createItem.isPending || updateItem.isPending}>
              Simpan
            </button>
            {isEdit && query.data?.status === 'published' ? (
              <a className="btn btn-ghost" href={ROUTES.unitAgendas(query.data.unit?.slug || '')} target="_blank" rel="noreferrer">
                Lihat di situs
              </a>
            ) : null}
            <button type="button" className="btn btn-ghost" onClick={() => navigate(ROUTES.adminAgendas)}>
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
