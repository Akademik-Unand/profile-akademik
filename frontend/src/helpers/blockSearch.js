import { BUILDER_BLOCK_LABELS, BUILDER_BLOCK_META } from '../constants/builder';

export function blockMatchesQuery(type, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const meta = BUILDER_BLOCK_META[type] || {};
  const haystack = [type, BUILDER_BLOCK_LABELS[type], meta.description].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(q);
}
