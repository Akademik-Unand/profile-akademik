import { apiClient } from '../apiClient';

export const pagesService = {
  getAll: (params) => apiClient.get('/admin/pages', { params }),
  getById: (id) => apiClient.get(`/admin/pages/${id}`),
  create: (payload) => apiClient.post('/admin/pages', payload),
  update: (id, payload) => apiClient.put(`/admin/pages/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/pages/${id}`),
  getPublic: (unitSlug, pageSlug) => apiClient.get(`/units/${unitSlug}/pages/${pageSlug}`),
};

export const postsService = {
  getAll: (params) => apiClient.get('/admin/posts', { params }),
  getById: (id) => apiClient.get(`/admin/posts/${id}`),
  create: (payload) => apiClient.post('/admin/posts', payload),
  update: (id, payload) => apiClient.put(`/admin/posts/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/posts/${id}`),
  getPublicList: (unitSlug, params) => apiClient.get(`/units/${unitSlug}/posts`, { params }),
  getPublic: (unitSlug, postSlug) => apiClient.get(`/units/${unitSlug}/posts/${postSlug}`),
};

export const categoriesService = {
  getAll: (params) => apiClient.get('/admin/post-categories', { params }),
  getById: (id) => apiClient.get(`/admin/post-categories/${id}`),
  create: (payload) => apiClient.post('/admin/post-categories', payload),
  update: (id, payload) => apiClient.put(`/admin/post-categories/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/post-categories/${id}`),
  getPublic: (unitSlug) => apiClient.get(`/units/${unitSlug}/post-categories`),
};

export const mediaService = {
  getAll: (params) => apiClient.get('/admin/media', { params }),
  getFolders: (params) => apiClient.get('/admin/media/folders', { params }),
  upload: (formData) =>
    apiClient.post('/admin/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  createFolder: (payload) => apiClient.post('/admin/media/folders', payload),
  update: (id, payload) => apiClient.put(`/admin/media/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/media/${id}`),
};

export const menusService = {
  getAll: (params) => apiClient.get('/admin/menus', { params }),
  getPublic: (unitSlug, location) => apiClient.get(`/units/${unitSlug}/menus`, { params: location ? { location } : undefined }),
  create: (payload) => apiClient.post('/admin/menus', payload),
  update: (id, payload) => apiClient.put(`/admin/menus/${id}`, payload),
  reorder: (items) => apiClient.put('/admin/menus/reorder', { items }),
  remove: (id) => apiClient.delete(`/admin/menus/${id}`),
};

export const organizationService = {
  getAll: (params) => apiClient.get('/admin/organization-members', { params }),
  getById: (id) => apiClient.get(`/admin/organization-members/${id}`),
  create: (payload) => apiClient.post('/admin/organization-members', payload),
  update: (id, payload) => apiClient.put(`/admin/organization-members/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/organization-members/${id}`),
  getPublic: (unitSlug) => apiClient.get(`/units/${unitSlug}/organization`),
};

export const agendasService = {
  getAll: (params) => apiClient.get('/admin/agendas', { params }),
  getById: (id) => apiClient.get(`/admin/agendas/${id}`),
  create: (payload) => apiClient.post('/admin/agendas', payload),
  update: (id, payload) => apiClient.put(`/admin/agendas/${id}`, payload),
  remove: (id) => apiClient.delete(`/admin/agendas/${id}`),
  getPublic: (unitSlug, params) => apiClient.get(`/units/${unitSlug}/agendas`, { params }),
};

export const landingsService = {
  getCurrent: (params) => apiClient.get('/admin/landings/current', { params }),
  upsert: (payload) => apiClient.put('/admin/landings', payload),
};
