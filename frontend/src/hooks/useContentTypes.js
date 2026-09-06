import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentTypesService } from '../services/contentTypes/contentTypes.service';

function useContentMutation(fn, keys) {
  const client = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: (result) => { toast.success(result.message); keys.forEach((key) => client.invalidateQueries({ queryKey: key })); }, onError: (error) => toast.error(error.message || 'Aksi gagal') });
}
export const useContentTypes = (params) => useQuery({ queryKey: ['content-types', params], queryFn: async () => (await contentTypesService.getAll(params)).data });
export const useContentType = (id) => useQuery({ queryKey: ['content-types', id], queryFn: async () => (await contentTypesService.getById(id)).data.contentType, enabled: Boolean(id) });
export const useCreateContentType = () => useContentMutation(contentTypesService.create, [['content-types']]);
export const useUpdateContentType = () => useContentMutation(({ id, payload }) => contentTypesService.update(id, payload), [['content-types']]);
export const useCreateContentTypeVersion = () => useContentMutation(({ id, schema }) => contentTypesService.createVersion(id, schema), [['content-types']]);
export const usePublishContentTypeVersion = () => useContentMutation(({ id, version }) => contentTypesService.publishVersion(id, version), [['content-types']]);
export const useContentEntries = (typeId, params) => useQuery({ queryKey: ['content-entries', typeId, params], queryFn: async () => (await contentTypesService.getEntries(typeId, params)).data, enabled: Boolean(typeId) });
export const useContentEntry = (typeId, id) => useQuery({ queryKey: ['content-entries', typeId, id], queryFn: async () => (await contentTypesService.getEntry(typeId, id)).data.entry, enabled: Boolean(typeId && id) });
export const useCreateContentEntry = (typeId) => useContentMutation((payload) => contentTypesService.createEntry(typeId, payload), [['content-entries', typeId]]);
export const useUpdateContentEntry = (typeId) => useContentMutation(({ id, payload }) => contentTypesService.updateEntry(typeId, id, payload), [['content-entries', typeId]]);
export const useDeleteContentEntry = (typeId) => useContentMutation((id) => contentTypesService.removeEntry(typeId, id), [['content-entries', typeId]]);
export const usePublicContentEntries = (unitSlug, typeSlug, params) => useQuery({ queryKey: ['content-entries', 'public', unitSlug, typeSlug, params], queryFn: async () => (await contentTypesService.getPublicEntries(unitSlug, typeSlug, params)).data, enabled: Boolean(unitSlug && typeSlug) });
export const usePublicContentEntry = (unitSlug, typeSlug, entrySlug) => useQuery({ queryKey: ['content-entry', 'public', unitSlug, typeSlug, entrySlug], queryFn: async () => (await contentTypesService.getPublicEntry(unitSlug, typeSlug, entrySlug)).data, enabled: Boolean(unitSlug && typeSlug && entrySlug), retry: false });
