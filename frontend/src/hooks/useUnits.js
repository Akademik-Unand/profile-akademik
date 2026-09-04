import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitsService } from '../services/units/units.service';

export function usePublicUnits(params, options = {}) {
  return useQuery({
    queryKey: ['units', 'public', params],
    queryFn: async () => {
      const payload = await unitsService.getPublic(params);
      return payload.data;
    },
    ...options,
  });
}

export function usePublicSiteUnit(unitSlug) {
  const listQuery = usePublicUnits(
    { limit: 1, isDefault: true, sortBy: 'name', sortOrder: 'asc' },
    { enabled: !unitSlug },
  );
  const slug = unitSlug || listQuery.data?.items?.[0]?.slug;
  const unitQuery = usePublicUnit(slug);
  const pathSlug = unitQuery.data?.isDefault ? '' : unitQuery.data?.slug || unitSlug || '';
  return {
    ...unitQuery,
    slug,
    pathSlug,
    isLoading: (!unitSlug && listQuery.isLoading) || unitQuery.isLoading,
  };
}

export function usePublicUnit(slug) {
  return useQuery({
    queryKey: ['units', 'slug', slug],
    queryFn: async () => {
      const payload = await unitsService.getBySlug(slug);
      return payload.data.unit;
    },
    enabled: Boolean(slug),
    retry: false,
  });
}

export function useAdminUnits(params, options = {}) {
  return useQuery({
    queryKey: ['units', 'admin', params],
    queryFn: async () => {
      const payload = await unitsService.getAll(params);
      return payload.data;
    },
    ...options,
  });
}

export function useAdminUnit(id) {
  return useQuery({
    queryKey: ['units', 'admin', id],
    queryFn: async () => {
      const payload = await unitsService.getById(id);
      return payload.data.unit;
    },
    enabled: Boolean(id),
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unitsService.create,
    onSuccess: (payload) => {
      toast.success(payload.message);
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => toast.error(error.message || 'Gagal membuat unit'),
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => unitsService.update(id, payload),
    onSuccess: (payload) => {
      toast.success(payload.message);
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => toast.error(error.message || 'Gagal memperbarui unit'),
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unitsService.remove,
    onSuccess: (payload) => {
      toast.success(payload.message);
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error) => toast.error(error.message || 'Gagal menghapus unit'),
  });
}
