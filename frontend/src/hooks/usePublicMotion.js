import { useLocation } from 'react-router-dom';
import { useAosRefresh } from '../helpers/aosInit';

/**
 * Inisialisasi AOS di situs publik dan pratinjau, lalu refresh saat rute berubah.
 */
export function usePublicMotion() {
  const location = useLocation();
  useAosRefresh(`${location.pathname}?${location.search}`);
}
