import { agendaDisplay } from '../../helpers/dataDisplay';
import { showEditorChrome } from '../../helpers/builderChrome';
import { DataItemProvider, useItemTemplate, useLoopPreviewItem } from '../DataItemContext';
import { ItemTemplate } from '../ItemTemplate';
import { Slot } from './layout';

function loopClass(layout) {
  return layout === 'cards' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4';
}

/**
 * Satu slot desain item. Editor menampilkan cetakannya; pratinjau/situs mengulang per data.
 */
export function DataLoop({ id, slot, items = [], source, pathSlug, display, puck, fallback }) {
  const template = useItemTemplate(id, slot);
  const editing = showEditorChrome(puck);
  const preview = useLoopPreviewItem(items, source);
  const layout = agendaDisplay(display).layout;

  if (editing) {
    return (
      <div>
        <p className="mb-2 text-xs text-neutral-500">Cetakan satu item. Di pratinjau dan situs bentuk ini diulang untuk tiap data.</p>
        <DataItemProvider item={preview} source={source} pathSlug={pathSlug}>
          <Slot slot={slot} />
        </DataItemProvider>
        {!template.length ? <div className="mt-4">{fallback}</div> : null}
      </div>
    );
  }

  if (!template.length) return fallback;
  if (!items.length) return null;

  return (
    <div className={loopClass(layout)}>
      {items.map((row) => (
        <DataItemProvider key={row.id} item={row} source={source} pathSlug={pathSlug}>
          <ItemTemplate items={template} />
        </DataItemProvider>
      ))}
    </div>
  );
}
