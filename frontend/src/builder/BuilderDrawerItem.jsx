import { BUILDER_BLOCK_LABELS, BUILDER_BLOCK_META } from '../constants/builder';
import { blockMatchesQuery } from '../helpers/blockSearch';
import { Icon } from '../components/ui/Icon';
import { useDrawerQuery } from './BuilderDrawerFilter';

/**
 * Item daftar blok: ikon, nama, dan keterangan singkat.
 */
export function BuilderDrawerItem({ name }) {
  const key = String(name || '');
  const query = useDrawerQuery();
  const meta = BUILDER_BLOCK_META[key] || {};

  if (!blockMatchesQuery(key, query)) {
    return <span data-builder-hidden="true" hidden />;
  }

  return (
    <div className="flex items-start gap-2 py-0.5" data-block-key={key}>
      <Icon icon={meta.icon || 'mdi:cube-outline'} className="mt-0.5 size-4 shrink-0 text-base-content/70" />
      <div className="min-w-0">
        <p className="text-sm leading-5">{BUILDER_BLOCK_LABELS[key] || key}</p>
        {meta.description ? <p className="text-[11px] leading-4 text-base-content/55">{meta.description}</p> : null}
      </div>
    </div>
  );
}
