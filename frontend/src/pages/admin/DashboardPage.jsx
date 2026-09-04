import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useCurrentUser } from '../../hooks/useAuth';
import { useAdminUnits } from '../../hooks/useUnits';
import { roleLabel } from '../../constants/roles';
import { PageHeader } from '../../components/admin/PageHeader';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { DashboardCharts } from '../../components/admin/DashboardCharts';
import { DashboardUnitsCard } from '../../components/admin/DashboardUnitsCard';
import { DashboardSkeleton } from '../../components/admin/DashboardSkeleton';

const UNIT_PARAMS = { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' };

export default function DashboardPage() {
  const { isLoading: userLoading } = useCurrentUser();
  const user = useAuthStore((state) => state.user);
  const theme = useUiStore((state) => state.theme);
  const canListAdmin = user?.role === 'superadmin';
  const unitsQuery = useAdminUnits(UNIT_PARAMS, { enabled: Boolean(canListAdmin) });

  if (userLoading || !user || (canListAdmin && unitsQuery.isLoading)) {
    return <DashboardSkeleton />;
  }

  const units = canListAdmin ? unitsQuery.data?.items || [] : user.units || [];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`${roleLabel(user.role)} — ${user.email}`} />
      <DashboardStats units={units} />
      <DashboardCharts units={units} theme={theme} />
      <DashboardUnitsCard units={units} />
    </div>
  );
}
