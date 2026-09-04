import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ROUTES } from '../../constants/routes';
import { datePartsId } from '../../helpers/cmsDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';

export function AgendaSection({ items = [], unitSlug, title }) {
  if (!items.length) return null;
  const heading = sectionTitle(title, 'Agenda');

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-headline text-2xl text-neutral-900">{heading}</h2>
        <Link to={ROUTES.unitAgendas(unitSlug)} className="text-sm text-primary">
          Semua
        </Link>
      </div>
      <ul className="divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 bg-surface">
        {items.map((item) => {
          const date = datePartsId(item.startsAt);
          return (
            <li key={item.id} className="flex gap-4 px-4 py-4">
              {date ? (
                <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-mist text-center">
                  <span className="font-headline text-xl text-primary">{date.day}</span>
                  <span className="text-xs uppercase text-neutral-500">{date.month}</span>
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block text-sm text-neutral-900">{item.title}</span>
                <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-neutral-500">
                  {item.timeText ? (
                    <span className="inline-flex items-center gap-1">
                      <Icon icon="mdi:clock-outline" className="size-3.5" />
                      {item.timeText}
                    </span>
                  ) : null}
                  {item.location ? (
                    <span className="inline-flex items-center gap-1">
                      <Icon icon="mdi:map-marker-outline" className="size-3.5" />
                      {item.location}
                    </span>
                  ) : null}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
