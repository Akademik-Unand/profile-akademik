import { Icon } from '../ui/Icon';
import { formatDateId } from '../../helpers/cmsDisplay';
import { agendaDisplay, showDataField } from '../../helpers/dataDisplay';

function AgendaMeta({ item, display }) {
  return (
    <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-neutral-600">
      {showDataField(display, 'time') && item.timeText ? (
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:clock-outline" className="size-4" />
          {item.timeText}
        </span>
      ) : null}
      {showDataField(display, 'location') && item.location ? (
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:map-marker-outline" className="size-4" />
          {item.location}
        </span>
      ) : null}
    </p>
  );
}

function AgendaBody({ item, display, titleClass }) {
  return (
    <>
      {showDataField(display, 'date') && item.startsAt ? (
        <p className="text-xs text-primary">{formatDateId(item.startsAt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      ) : null}
      {showDataField(display, 'title') ? <h2 className={titleClass}>{item.title}</h2> : null}
      <AgendaMeta item={item} display={display} />
      {showDataField(display, 'description') && item.description ? <p className="mt-2 text-sm text-neutral-600">{item.description}</p> : null}
    </>
  );
}

export function AgendaList({ items = [], display }) {
  const view = agendaDisplay(display);
  if (!items.length) return <p className="text-sm text-neutral-600">Belum ada agenda yang dipublikasikan.</p>;

  if (view.layout === 'cards') {
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-md border border-neutral-200 bg-surface px-4 py-4">
            <AgendaBody item={item} display={view} titleClass="mt-1 font-headline text-lg text-neutral-900" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="border-l-2 border-primary bg-surface px-4 py-4">
          <AgendaBody item={item} display={view} titleClass="mt-1 font-headline text-lg text-neutral-900" />
        </li>
      ))}
    </ul>
  );
}
