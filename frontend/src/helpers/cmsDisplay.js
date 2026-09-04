export const FALLBACK_UNIT_LOGO = '/images/unand.png';

export function unitScopeName(unit) {
  return unit?.name || 'Situs utama';
}

export function payloadUnitId(value) {
  if (value === '' || value === undefined || value === null || Number.isNaN(Number(value))) return null;
  return Number(value);
}

export function unitLogoUrl(unit) {
  return unit?.logo?.url || FALLBACK_UNIT_LOGO;
}

export function formatDateId(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('id-ID', options);
}

export function datePartsId(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('id-ID', { month: 'short' }),
    year: date.getFullYear(),
  };
}
