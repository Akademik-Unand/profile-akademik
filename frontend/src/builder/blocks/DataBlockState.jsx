import { showEditorChrome } from '../../helpers/builderChrome';
import { BlockPlaceholder } from './placeholder';

/**
 * Blok data situs: skeleton saat fetch, penanda di editor kalau hasilnya kosong.
 * Di situs publik tetap disembunyikan kalau belum ada data.
 */
export function DataBlockState({ puck, ready, query, items, emptyLabel, emptyPreview, children }) {
  if (!ready) {
    return showEditorChrome(puck) ? emptyPreview || <BlockPlaceholder label={emptyLabel} /> : <div className="skeleton h-40 w-full" />;
  }
  if (query.isPending) {
    return <div className="skeleton h-40 w-full" />;
  }

  const list = items ?? query.data?.items;
  const empty = Array.isArray(list) ? list.length === 0 : !query.data;
  if (empty) {
    if (showEditorChrome(puck)) return emptyPreview || <BlockPlaceholder label={emptyLabel} />;
    return null;
  }

  return children;
}
