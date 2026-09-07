import { Navigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { AdminField } from '../../components/admin/AdminField';
import { loginSchema } from '../../validations/auth.schema';
import { useCurrentUser, useLogin } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const { data: user, isLoading, isFetching, error } = useCurrentUser();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (user) {
    return <Navigate to={ROUTES.adminDashboard} replace />;
  }

  const checkingSession = !user && !error && (isLoading || isFetching);
  if (checkingSession) {
    return (
      <AuthLayout title="Masuk admin" subtitle="Web profil Bidang Akademik Universitas Andalas">
        <div className="skeleton h-40 w-full" />
      </AuthLayout>
    );
  }

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
