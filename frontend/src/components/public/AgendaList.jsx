import { Icon } from '../ui/Icon';
import { formatDateId } from '../../helpers/cmsDisplay';

export function AgendaList({ items = [] }) {
  if (!items.length) return <p className="text-sm text-neutral-600">Belum ada agenda yang dipublikasikan.</p>;

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="border-l-2 border-primary bg-surface px-4 py-4">
          <p className="text-xs text-primary">{formatDateId(item.startsAt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h2 className="mt-1 font-headline text-lg text-neutral-900">{item.title}</h2>
          <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-neutral-600">
            {item.timeText ? (
              <span className="inline-flex items-center gap-1">
                <Icon icon="mdi:clock-outline" className="size-4" />
                {item.timeText}
              </span>
            ) : null}
            {item.location ? (
              <span className="inline-flex items-center gap-1">
                <Icon icon="mdi:map-marker-outline" className="size-4" />
                {item.location}
              </span>
            ) : null}
          </p>
          {item.description ? <p className="mt-2 text-sm text-neutral-600">{item.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}
