import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { SeoFields } from '../../../components/admin/SeoFields';
import { unitSeoSchema } from '../../../validations/iam/user.schema';
import { useAdminUnit, useAdminUnits, useUpdateUnit } from '../../../hooks/useUnits';
import { useAuthStore } from '../../../store/auth.store';

export default function SeoSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useAdminUnits({ limit: 100, sortBy: 'name', sortOrder: 'asc' });
  const units = data?.items || user?.units || [];
  const defaultUnitId = units[0]?.id || '';
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(unitSeoSchema),
    defaultValues: { unitId: defaultUnitId, seoTitle: '', seoDescription: '', seoKeywords: '' },
  });

  const unitId = watch('unitId') || defaultUnitId;
  const unitQuery = useAdminUnit(unitId);
  const updateUnit = useUpdateUnit();

  useEffect(() => {
    if (!unitId && defaultUnitId) setValue('unitId', defaultUnitId);
  }, [defaultUnitId, setValue, unitId]);

  useEffect(() => {
    if (unitQuery.data) {
      reset({
        unitId: unitQuery.data.id,
        seoTitle: unitQuery.data.seoTitle || '',
        seoDescription: unitQuery.data.seoDescription || '',
        seoKeywords: unitQuery.data.seoKeywords || '',
      });
    }
  }, [unitQuery.data, reset]);

  async function onSubmit(values) {
    await updateUnit.mutateAsync({
      id: values.unitId || unitId,
      payload: {
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
        seoKeywords: values.seoKeywords || null,
      },
    });
  }

  return (
    <div className="w-full">
      <PageHeader
        title="Pengaturan SEO"
        subtitle="Judul, deskripsi, dan kata kunci default untuk situs unit."
        breadcrumbs={[{ label: 'SEO' }]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          {units.length > 1 ? (
            <AdminField label="Unit">
              <select className="select w-full" {...register('unitId', { valueAsNumber: true })}>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </AdminField>
          ) : null}
          {unitQuery.isLoading ? <div className="skeleton h-40 w-full" /> : <SeoFields register={register} errors={errors} names={{ title: 'seoTitle', description: 'seoDescription', keywords: 'seoKeywords' }} />}
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={updateUnit.isPending || !unitId}>
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
