import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { landingServiceItems, sectionTitle } from '../../helpers/landingBlocks';

export function ServiceTiles({ landing, unitSlug }) {
  const items = landingServiceItems(landing?.services, unitSlug);
  if (!items.length) return null;
  const heading = sectionTitle(landing?.servicesTitle, '');
  const columns = items.length >= 6 ? 'sm:grid-cols-3 lg:grid-cols-6' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:-mt-20 md:px-6" data-landing-services>
      {heading ? <h2 className="sr-only">{heading}</h2> : null}
      <div className={`grid overflow-hidden rounded-md border border-neutral-200 bg-surface ${columns}`}>
        {items.map((item) => {
          const className =
            'flex flex-col items-center justify-center gap-2 px-4 py-5 text-center text-sm text-neutral-800 hover:bg-mist';
          const inner = (
            <>
              <Icon icon={item.icon} className="size-6 shrink-0 text-primary" />
              <span>{item.label}</span>
            </>
          );
          return item.external ? (
            <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
              {inner}
            </a>
          ) : (
            <Link key={item.key} to={item.url} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
