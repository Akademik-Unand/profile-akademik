import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { ROUTES } from '../../constants/routes';
import { datePartsId } from '../../helpers/cmsDisplay';
import { agendaDisplay, showDataField } from '../../helpers/dataDisplay';
import { sectionTitle } from '../../helpers/landingBlocks';
import { AgendaList } from './AgendaList';

export function AgendaSection({ items = [], unitSlug, title, display }) {
  const view = agendaDisplay(display);
  if (!items.length) return null;
  const heading = sectionTitle(title, 'Agenda terdekat');

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-primary">Kalender</p>
          <h2 className="mt-1 font-headline text-2xl text-neutral-900 md:text-3xl">{heading}</h2>
        </div>
        <Link to={ROUTES.unitAgendas(unitSlug)} className="shrink-0 text-sm text-primary">
          Semua
        </Link>
      </div>
      {view.layout === 'cards' ? (
        <AgendaList items={items} display={view} />
      ) : (
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {items.map((item) => {
            const date = datePartsId(item.startsAt);
            return (
              <li key={item.id} className="flex gap-4 py-5">
                {showDataField(view, 'date') && date ? (
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-surface text-center">
                    <span className="font-headline text-xl text-primary">{date.day}</span>
                    <span className="text-xs uppercase text-neutral-600">{date.month}</span>
                  </span>
                ) : null}
                <span className="min-w-0">
                  {showDataField(view, 'title') ? <span className="block text-sm text-neutral-900">{item.title}</span> : null}
                  <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-neutral-600">
                    {showDataField(view, 'time') && item.timeText ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="mdi:clock-outline" className="size-3.5" />
                        {item.timeText}
                      </span>
                    ) : null}
                    {showDataField(view, 'location') && item.location ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="mdi:map-marker-outline" className="size-3.5" />
                        {item.location}
                      </span>
                    ) : null}
                  </span>
                  {showDataField(view, 'description') && item.description ? (
                    <span className="public-copy mt-2 block text-sm">{item.description}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
