import axios from 'axios';
import { toast } from 'sonner';
import { env } from '../config/env';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && payload.success === false) {
      return Promise.reject(payload);
    }
    return payload;
  },
  (error) => {
    const payload = error.response?.data;
    const url = error.config?.url || '';
    const isMeRequest = url.includes('/auth/me');
    const status = error.response?.status;

    if (status >= 500) {
      toast.error(payload?.message || 'Terjadi kesalahan server');
    } else if (status === 401 && !isMeRequest && !url.includes('/auth/login')) {
      toast.error(payload?.message || 'Sesi telah berakhir');
    }

    return Promise.reject(payload || error);
  },
);
