import { BLOCK_TYPES, SLOT_KEYS, SLOT_KEYS_BY_TYPE } from '../constants/builder';

function isBlock(item) {
  return Boolean(item && BLOCK_TYPES.includes(item.type));
}

function zonesForComponent(id, zones) {
  if (!id || !zones) return [];
  return Object.entries(zones)
    .filter(([key]) => key.startsWith(`${id}:`))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, items]) => (Array.isArray(items) ? items : []));
}

function liftItem(item, zones) {
  if (!isBlock(item)) return item;
  const keys = SLOT_KEYS_BY_TYPE[item.type];
  const props = { ...(item.props || {}) };
  if (keys) {
    const fromZones = zonesForComponent(props.id, zones);
    keys.forEach((key, index) => {
      if (!Array.isArray(props[key])) props[key] = fromZones[index] || [];
    });
  }
  SLOT_KEYS.forEach((key) => {
    if (Array.isArray(props[key]) && props[key].some((row) => row?.type)) {
      props[key] = props[key].map((child) => liftItem(child, zones));
    }
  });
  return { ...item, props };
}

export function filterSlotTree(items, allow) {
  if (!Array.isArray(items)) return [];
  return items.filter(allow).map((item) => {
    const props = { ...(item.props || {}) };
    SLOT_KEYS.forEach((key) => {
      if (Array.isArray(props[key]) && props[key].some((row) => row?.type)) {
        props[key] = filterSlotTree(props[key], allow);
      }
    });
    return { ...item, props };
  });
}

/**
 * DropZone lama menyimpan anak di data.zones (`id:zone`).
 * Slot Puck menyimpan anak di props komponen.
 */
export function migrateBuilderDocument(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const content = Array.isArray(doc.content) ? doc.content.map((item) => liftItem(item, doc.zones || {})) : [];
  return { ...doc, content, zones: {} };
}
