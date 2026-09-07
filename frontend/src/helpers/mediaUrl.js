import { env } from '../config/env';

/**
 * Pastikan URL media bisa ditampilkan di Vite (origin API), relatif `/uploads`, atau absolut.
 */
export function resolveMediaSrc(url) {
  if (typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) {
    const origin = String(env.apiBaseUrl || '').replace(/\/api\/v1\/?$/i, '') || (typeof window !== 'undefined' ? window.location.origin : '');
    return origin ? `${origin}${trimmed}` : trimmed;
  }
  return trimmed;
}
