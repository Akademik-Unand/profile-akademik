import { apiClient } from '../apiClient';

export const unitsService = {
  getPublic: (params) => apiClient.get('/units', { params }),
  getBySlug: (slug) => apiClient.get(`/units/${slug}`),
  getAll: (params) => apiClient.get('/admin/units', { params }),
  getById: (id) => apiClient.get(`/admin/units/${id}`),
  create: (payload) => apiClient.post('/admin/units', payload),
  update: (id, payload) => apiClient.put(`/admin/units/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/units/${id}`),
};
