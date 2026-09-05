import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { pagesService, postsService, categoriesService, mediaService, menusService, organizationService, agendasService, landingsService } from '../services/cms/cms.service';

function useCmsMutation(fn, invalidate) {
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

export function useAdminPages(params) {
  return useQuery({
    queryKey: ['pages', 'admin', params],
    queryFn: async () => (await pagesService.getAll(params)).data,
  });
}

export function useAdminPage(id) {
  return useQuery({
    queryKey: ['pages', 'admin', id],
    queryFn: async () => (await pagesService.getById(id)).data.page,
    enabled: Boolean(id),
  });
}

export function useCreatePage() {
  return useCmsMutation(pagesService.create, ['pages']);
}

export function useUpdatePage() {
  return useCmsMutation(({ id, payload }) => pagesService.update(id, payload), ['pages']);
}

export function useDeletePage() {
  return useCmsMutation(pagesService.remove, ['pages']);
}

export function usePublicPage(unitSlug, pageSlug) {
  return useQuery({
    queryKey: ['pages', 'public', unitSlug, pageSlug],
    queryFn: async () => (await pagesService.getPublic(unitSlug, pageSlug)).data,
    enabled: Boolean(unitSlug && pageSlug),
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useAdminPosts(params) {
  return useQuery({
    queryKey: ['posts', 'admin', params],
    queryFn: async () => (await postsService.getAll(params)).data,
  });
}

export function useAdminPost(id) {
  return useQuery({
    queryKey: ['posts', 'admin', id],
    queryFn: async () => (await postsService.getById(id)).data.post,
    enabled: Boolean(id),
  });
}

export function useCreatePost() {
  return useCmsMutation(postsService.create, ['posts']);
}

export function useUpdatePost() {
  return useCmsMutation(({ id, payload }) => postsService.update(id, payload), ['posts']);
}

export function useDeletePost() {
  return useCmsMutation(postsService.remove, ['posts']);
}

export function usePublicPosts(unitSlug, params) {
  return useQuery({
    queryKey: ['posts', 'public', unitSlug, params],
    queryFn: async () => (await postsService.getPublicList(unitSlug, params)).data,
    enabled: Boolean(unitSlug),
  });
}

export function usePublicPost(unitSlug, postSlug) {
  return useQuery({
    queryKey: ['posts', 'public', unitSlug, postSlug],
    queryFn: async () => (await postsService.getPublic(unitSlug, postSlug)).data,
    enabled: Boolean(unitSlug && postSlug),
    retry: false,
  });
}

export function usePublicCategories(unitSlug) {
  return useQuery({
    queryKey: ['categories', 'public', unitSlug],
    queryFn: async () => (await categoriesService.getPublic(unitSlug)).data,
    enabled: Boolean(unitSlug),
  });
}

export function useAdminCategories(params) {
  return useQuery({
    queryKey: ['categories', 'admin', params],
    queryFn: async () => (await categoriesService.getAll(params)).data,
  });
}

export function useCreateCategory() {
  return useCmsMutation(categoriesService.create, ['categories']);
}

export function useUpdateCategory() {
  return useCmsMutation(({ id, payload }) => categoriesService.update(id, payload), ['categories']);
}

export function useDeleteCategory() {
  return useCmsMutation(categoriesService.remove, ['categories']);
}

export function useAdminMedia(params, options = {}) {
  return useQuery({
    queryKey: ['media', 'admin', params],
    queryFn: async () => (await mediaService.getAll(params)).data,
    ...options,
  });
}

export function useUploadMedia() {
  return useCmsMutation(mediaService.upload, ['media']);
}

export function useDeleteMedia() {
  return useCmsMutation(mediaService.remove, ['media']);
}

export function useAdminMenus(params) {
  return useQuery({
    queryKey: ['menus', 'admin', params],
    queryFn: async () => (await menusService.getAll(params)).data,
  });
}

export function useCreateMenu() {
  return useCmsMutation(menusService.create, ['menus']);
}

export function useUpdateMenu() {
  return useCmsMutation(({ id, payload }) => menusService.update(id, payload), ['menus']);
}

export function useReorderMenus() {
  return useCmsMutation(menusService.reorder, ['menus']);
}

export function useDeleteMenu() {
  return useCmsMutation(menusService.remove, ['menus']);
}

export function usePublicMenus(unitSlug, location) {
  return useQuery({
    queryKey: ['menus', 'public', unitSlug, location],
    queryFn: async () => (await menusService.getPublic(unitSlug, location)).data,
    enabled: Boolean(unitSlug),
  });
}

export function useAdminOrganization(params) {
  return useQuery({
    queryKey: ['organization', 'admin', params],
    queryFn: async () => (await organizationService.getAll(params)).data,
  });
}

export function useCreateOrganizationMember() {
  return useCmsMutation(organizationService.create, ['organization']);
}

export function useUpdateOrganizationMember() {
  return useCmsMutation(({ id, payload }) => organizationService.update(id, payload), ['organization']);
}

export function useDeleteOrganizationMember() {
  return useCmsMutation(organizationService.remove, ['organization']);
}

export function usePublicOrganization(unitSlug) {
  return useQuery({
    queryKey: ['organization', 'public', unitSlug],
    queryFn: async () => (await organizationService.getPublic(unitSlug)).data,
    enabled: Boolean(unitSlug),
  });
}

export function useAdminAgendas(params) {
  return useQuery({
    queryKey: ['agendas', 'admin', params],
    queryFn: async () => (await agendasService.getAll(params)).data,
  });
}

export function useAdminAgenda(id) {
  return useQuery({
    queryKey: ['agendas', 'admin', id],
    queryFn: async () => (await agendasService.getById(id)).data.agenda,
    enabled: Boolean(id),
  });
}

export function useCreateAgenda() {
  return useCmsMutation(agendasService.create, ['agendas']);
}

export function useUpdateAgenda() {
  return useCmsMutation(({ id, payload }) => agendasService.update(id, payload), ['agendas']);
}

export function useDeleteAgenda() {
  return useCmsMutation(agendasService.remove, ['agendas']);
}

export function usePublicAgendas(unitSlug, params) {
  return useQuery({
    queryKey: ['agendas', 'public', unitSlug, params],
    queryFn: async () => (await agendasService.getPublic(unitSlug, params)).data,
    enabled: Boolean(unitSlug),
  });
}

export function useLandingCurrent(params) {
  return useQuery({
    queryKey: ['landings', 'current', params],
    queryFn: async () => (await landingsService.getCurrent(params)).data.landing,
  });
}

export function useUpsertLanding() {
  return useCmsMutation(landingsService.upsert, ['landings', 'units']);
}
