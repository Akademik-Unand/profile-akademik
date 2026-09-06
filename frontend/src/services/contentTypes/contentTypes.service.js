import { apiClient } from '../apiClient';

export const contentTypesService = {
  getAll: (params) => apiClient.get('/admin/content-types', { params }),
  getById: (id) => apiClient.get(`/admin/content-types/${id}`),
  create: (payload) => apiClient.post('/admin/content-types', payload),
  update: (id, payload) => apiClient.put(`/admin/content-types/${id}`, payload),
  createVersion: (id, schema) => apiClient.post(`/admin/content-types/${id}/versions`, { schema }),
  publishVersion: (id, version) => apiClient.post(`/admin/content-types/${id}/versions/${version}/publish`),
  getEntries: (typeId, params) => apiClient.get(`/admin/content-types/${typeId}/entries`, { params }),
  getEntry: (typeId, id) => apiClient.get(`/admin/content-types/${typeId}/entries/${id}`),
  createEntry: (typeId, payload) => apiClient.post(`/admin/content-types/${typeId}/entries`, payload),
  updateEntry: (typeId, id, payload) => apiClient.put(`/admin/content-types/${typeId}/entries/${id}`, payload),
  removeEntry: (typeId, id) => apiClient.delete(`/admin/content-types/${typeId}/entries/${id}`),
  getPublicEntries: (unitSlug, typeSlug, params) => apiClient.get(`/units/${unitSlug}/data/${typeSlug}`, { params }),
  getPublicEntry: (unitSlug, typeSlug, entrySlug) => apiClient.get(`/units/${unitSlug}/content/${typeSlug}/${entrySlug}`),
};
