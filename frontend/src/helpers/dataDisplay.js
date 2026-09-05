import {
  DATA_LAYOUTS,
  DISPLAY_BOOL_KEYS,
  defaultAgendaDisplay,
  defaultPostDisplay,
} from '../constants/dataDisplay';

const LAYOUTS = DATA_LAYOUTS.map((item) => item.value);

export function sanitizeDataDisplay(display, fallback) {
  const base = fallback && typeof fallback === 'object' ? fallback : defaultAgendaDisplay();
  const raw = display && typeof display === 'object' && !Array.isArray(display) ? display : {};
  const next = { ...base, layout: LAYOUTS.includes(raw.layout) ? raw.layout : base.layout };
  DISPLAY_BOOL_KEYS.forEach((key) => {
    if (raw[key] === undefined) return;
    next[key] = raw[key] !== false && raw[key] !== 'false';
  });
  return next;
}

export function agendaDisplay(display) {
  return sanitizeDataDisplay(display, defaultAgendaDisplay());
}

export function postDisplay(display) {
  return sanitizeDataDisplay(display, defaultPostDisplay());
}

export function showDataField(display, key) {
  return display?.[key] !== false;
}
