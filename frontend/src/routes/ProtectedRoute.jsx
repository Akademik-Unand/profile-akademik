import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import { defineAbility } from '../policies/defineAbility';
import { AbilityProvider } from '../policies/AbilityContext';
import { ROUTES } from '../constants/routes';
import { useUiStore } from '../store/ui.store';

function GuardSkeleton() {
  const theme = useUiStore((state) => state.theme);

  return (
    <div id="admin-app" data-theme={theme} className="min-h-svh bg-base-200 p-6">
      <div className="skeleton mb-4 h-8 w-48" />
      <div className="skeleton h-40 w-full" />
    </div>
  );
}

export function ProtectedRoute({ children, action, subject }) {
  const location = useLocation();
  const { data: user, isLoading, isError, isFetching, error } = useCurrentUser();
  const unauthorized = error?.statusCode === 401;

  if (unauthorized) {
    return <Navigate to={ROUTES.adminLogin} replace state={{ from: location }} />;
  }

  if (!user && (isLoading || isFetching || isError)) {
    return <GuardSkeleton />;
  }

  if (!user) {
    return <Navigate to={ROUTES.adminLogin} replace state={{ from: location }} />;
  }

  const ability = defineAbility(user);
  if (action && subject && !ability.can(action, subject)) {
    return <Navigate to={ROUTES.adminDashboard} replace />;
  }

  return <AbilityProvider value={ability}>{children}</AbilityProvider>;
}
