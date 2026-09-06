const FORMATTERS = Object.freeze({
  text: (value) => String(value ?? ''),
  uppercase: (value) => String(value ?? '').toUpperCase(),
  lowercase: (value) => String(value ?? '').toLowerCase(),
  number: (value) => new Intl.NumberFormat('id-ID').format(Number(value) || 0),
  date: (value) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(value)) : '',
  datetime: (value) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)) : '',
  boolean: (value) => value ? 'Ya' : 'Tidak',
});

export const DYNAMIC_FORMATTER_OPTIONS = Object.keys(FORMATTERS).map((value) => ({ label: value, value }));

export function safeFormat(value, formatter = 'text') {
  const format = FORMATTERS[formatter] || FORMATTERS.text;
  try { return format(value); } catch { return FORMATTERS.text(value); }
}

export function readDynamicValue(entry, path) {
  if (!path || typeof path !== 'string') return undefined;
  const safePath = path.replace(/^fields\./, '');
  if (!/^[a-zA-Z][\w.]*$/.test(safePath)) return undefined;
  return safePath.split('.').reduce((value, key) => value?.[key], entry?.fields || entry?.data || entry);
}

export function dynamicEntryTitle(entry, type) {
  const titleField = type?.fields?.find((field) => field.isTitle) || type?.fields?.find((field) => field.type === 'text');
  return readDynamicValue(entry, titleField?.key) || entry?.title || entry?.slug || 'Tanpa judul';
}
