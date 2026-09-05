import { createContext, useContext } from 'react';
import { useBuilderRuntime } from './BuilderRuntime';
import { readTemplateItems, resolveDataField, sampleDataItem, sanitizeBindKey } from '../helpers/dataItem';

const DataItemContext = createContext({
  item: null,
  source: 'agenda',
  pathSlug: '',
});

export function DataItemProvider({ item, source = 'agenda', pathSlug = '', children }) {
  return <DataItemContext.Provider value={{ item, source, pathSlug }}>{children}</DataItemContext.Provider>;
}

export function useDataItem() {
  return useContext(DataItemContext);
}

/** Isi field data jika blok ada di dalam cetakan Agenda/Arsip dan sudah ditautkan. */
export function useBoundField(bind) {
  const ctx = useDataItem();
  const key = sanitizeBindKey(bind);
  if (!key || !ctx.item) return null;
  return resolveDataField(ctx.item, key, ctx);
}

export function usePuckDocument() {
  return useBuilderRuntime().document || null;
}

export function useItemTemplate(id, slot) {
  return readTemplateItems(slot, usePuckDocument(), id);
}

export function useLoopPreviewItem(items, source) {
  return items?.[0] || sampleDataItem(source);
}
