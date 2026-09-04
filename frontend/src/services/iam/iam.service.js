import { apiClient } from '../apiClient';

export const usersService = {
  getAll: (params) => apiClient.get('/admin/users', { params }),
  getById: (id) => apiClient.get(`/admin/users/${id}`),
  create: (payload) => apiClient.post('/admin/users', payload),
  update: (id, payload) => apiClient.put(`/admin/users/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/users/${id}`),
};

export const permissionsService = {
  getAll: (params) => apiClient.get('/admin/permissions', { params }),
  getMatrix: () => apiClient.get('/admin/permissions/matrix'),
  syncRole: (role, permissionIds) => apiClient.put(`/admin/permissions/roles/${role}`, { permissionIds }),
};
