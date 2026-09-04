import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService, permissionsService } from '../services/iam/iam.service';

function useIamMutation(fn, invalidate) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (payload) => {
      toast.success(payload.message);
      invalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
    onError: (error) => toast.error(error.message || 'Aksi gagal'),
  });
}

export function useAdminUsers(params) {
  return useQuery({
    queryKey: ['users', 'admin', params],
    queryFn: async () => (await usersService.getAll(params)).data,
  });
}

export function useAdminUser(id) {
  return useQuery({
    queryKey: ['users', 'admin', id],
    queryFn: async () => (await usersService.getById(id)).data.user,
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  return useIamMutation(usersService.create, ['users']);
}

export function useUpdateUser() {
  return useIamMutation(({ id, payload }) => usersService.update(id, payload), ['users']);
}

export function useDeleteUser() {
  return useIamMutation(usersService.remove, ['users']);
}

export function usePermissionMatrix() {
  return useQuery({
    queryKey: ['permissions', 'matrix'],
    queryFn: async () => (await permissionsService.getMatrix()).data,
  });
}

export function useSyncRolePermissions() {
  return useIamMutation(({ role, permissionIds }) => permissionsService.syncRole(role, permissionIds), ['permissions']);
}
