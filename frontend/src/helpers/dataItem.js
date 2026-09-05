import { SLOT_KEYS } from '../constants/builder';
import { DATA_FIELD_KEYS } from '../constants/dataFields';
import { SAMPLE_AGENDAS, SAMPLE_POSTS } from '../constants/dataDisplay';
import { formatDateId } from './cmsDisplay';
import { ROUTES } from '../constants/routes';

export function sanitizeDataFieldKey(value) {
  return DATA_FIELD_KEYS.includes(value) ? value : 'title';
}

export function sanitizeBindKey(value) {
  if (value === '' || value == null) return '';
  return DATA_FIELD_KEYS.includes(value) ? value : '';
}

export function sampleDataItem(source) {
  return source === 'post' ? SAMPLE_POSTS[0] : SAMPLE_AGENDAS[0];
}

export function findBuilderNode(doc, id) {
  if (!doc || !id) return null;
  const walk = (items) => {
    for (const item of items || []) {
      if (item?.props?.id === id || item?.id === id) return item;
      for (const key of SLOT_KEYS) {
        const nested = item?.props?.[key];
        if (Array.isArray(nested) && nested.some((row) => row?.type)) {
          const found = walk(nested);
          if (found) return found;
        }
      }
    }
    return null;
  };
  return walk(doc.content);
}

/** Dokumen yang dikirim ke <Render> lebih benar daripada store usePuck di halaman publik. */
export function pickBuilderDocument(runtimeDoc, puckDoc) {
  return runtimeDoc != null ? runtimeDoc : puckDoc || null;
}

export function readTemplateItems(slot, doc, id) {
  if (Array.isArray(slot) && slot.some((row) => row?.type)) return slot;
  const fromDoc = findBuilderNode(doc, id)?.props?.item;
  return Array.isArray(fromDoc) ? fromDoc.filter((row) => row?.type) : [];
}

export function resolveDataField(item, field, { source, pathSlug } = {}) {
  const key = sanitizeDataFieldKey(field);
  if (!item) return { type: 'empty', text: '', href: '', src: '' };

  if (key === 'title') return { type: 'text', text: item.title || '' };
  if (key === 'date') {
    const value = item.startsAt || item.publishedAt;
    return { type: 'text', text: value ? formatDateId(value, { day: 'numeric', month: 'long', year: 'numeric' }) : '' };
  }
  if (key === 'time') return { type: 'text', text: item.timeText || '' };
  if (key === 'location') return { type: 'text', text: item.location || '' };
  if (key === 'description') return { type: 'text', text: item.description || '' };
  if (key === 'excerpt') return { type: 'text', text: item.excerpt || '' };
  if (key === 'category') return { type: 'text', text: item.category?.name || '' };
  if (key === 'cover') return { type: 'image', src: item.cover?.url || '', text: item.title || '' };
  if (key === 'link') {
    const href = source === 'post' && item.slug ? ROUTES.unitPost(pathSlug, item.slug) : '';
    return { type: 'link', href, text: item.title || 'Buka' };
  }
  return { type: 'empty', text: '', href: '', src: '' };
}
