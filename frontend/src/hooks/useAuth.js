import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/auth/auth.service';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '../constants/routes';

export function useCurrentUser() {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const isAdminArea =
    location.pathname.startsWith('/admin') && location.pathname !== ROUTES.adminLogin;

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const payload = await authService.me();
      const user = payload.data.user;
      setUser(user);
      return user;
    },
    enabled: isAdminArea,
    retry: (failureCount, error) => {
      if (error?.statusCode === 401) return false;
      return failureCount < 4;
    },
    retryDelay: (failureCount) => Math.min(1000 * 2 ** failureCount, 8000),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    throwOnError: false,
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (payload) => {
      const user = payload.data.user;
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
      toast.success(payload.message);
      navigate(ROUTES.adminDashboard);
    },
    onError: (error) => {
      toast.error(error.message || 'Login gagal');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: (payload) => {
      clearUser();
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      toast.success(payload.message);
      navigate(ROUTES.adminLogin);
    },
    onError: (error) => {
      toast.error(error.message || 'Logout gagal');
    },
  });
}
