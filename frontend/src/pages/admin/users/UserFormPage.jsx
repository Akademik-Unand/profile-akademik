import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../../components/admin/PageHeader';
import { UserFormFields } from '../../../components/iam/UserFormFields';
import { userCreateSchema, userUpdateSchema } from '../../../validations/iam/user.schema';
import { useAdminUser, useCreateUser, useUpdateUser } from '../../../hooks/useIam';
import { useAdminUnits } from '../../../hooks/useUnits';
import { ROUTES } from '../../../constants/routes';

export default function UserFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const query = useAdminUser(id);
  const createItem = useCreateUser();
  const updateItem = useUpdateUser();
  const { data: units } = useAdminUnits({ limit: 100, sortBy: 'name', sortOrder: 'asc' });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? userUpdateSchema : userCreateSchema),
    defaultValues: { name: '', email: '', password: '', role: 'admin_unit', unitIds: [] },
  });

  const unitIds = watch('unitIds') || [];

  useEffect(() => {
    if (query.data) {
      reset({
        name: query.data.name,
        email: query.data.email,
        password: '',
        role: query.data.role,
        unitIds: query.data.unitIds || [],
      });
    }
  }, [query.data, reset]);

  function toggleUnit(unitId) {
    const next = unitIds.includes(unitId) ? unitIds.filter((value) => value !== unitId) : [...unitIds, unitId];
    setValue('unitIds', next, { shouldValidate: true });
  }

  async function onSubmit(values) {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
      unitIds: values.unitIds || [],
    };
    if (values.password) payload.password = values.password;
    if (isEdit) await updateItem.mutateAsync({ id, payload });
    else await createItem.mutateAsync(payload);
    navigate(ROUTES.adminUsers);
  }

  if (isEdit && query.isLoading) return <div className="skeleton h-64 w-full" />;

  return (
    <div className="w-full">
      <PageHeader
        title={isEdit ? 'Edit pengguna' : 'Tambah pengguna'}
        breadcrumbs={[{ label: 'Pengguna', path: ROUTES.adminUsers }, { label: isEdit ? 'Edit' : 'Tambah' }]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <UserFormFields
            register={register}
            errors={errors}
            units={units?.items || []}
            selectedUnitIds={unitIds}
            onToggleUnit={toggleUnit}
            isEdit={isEdit}
          />
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={createItem.isPending || updateItem.isPending}>
              Simpan
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(ROUTES.adminUsers)}>
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
