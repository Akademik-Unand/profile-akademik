import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { AdminField } from '../../components/admin/AdminField';
import { loginSchema } from '../../validations/auth.schema';
import { useLogin } from '../../hooks/useAuth';

export default function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <AuthLayout title="Masuk admin" subtitle="Web profil Bidang Akademik Universitas Andalas">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit((values) => login.mutate(values))}>
        <AdminField label="Email" error={errors.email?.message}>
          <input type="email" className="input w-full" autoComplete="email" {...register('email')} />
        </AdminField>
        <AdminField label="Password" error={errors.password?.message}>
          <input
            type="password"
            className="input w-full"
            autoComplete="current-password"
            {...register('password')}
          />
        </AdminField>
        <button type="submit" className="btn btn-primary mt-2" disabled={login.isPending}>
          {login.isPending ? <span className="loading loading-spinner loading-sm" /> : null}
          Masuk
        </button>
      </form>
    </AuthLayout>
  );
}
