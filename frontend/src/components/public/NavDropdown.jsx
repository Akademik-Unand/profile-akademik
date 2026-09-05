import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { isHrefActive, isMenuItemActive } from '../../helpers/menuActive';
import { MenuLink } from './MenuLink';

function DropdownPanel({ alignRight, wide, children }) {
  return (
    <div className={`public-dropdown-frame${alignRight ? ' is-end' : ''}${wide ? ' is-wide' : ''}`}>
      <div className={`public-dropdown${wide ? ' is-wide' : ''}`}>{children}</div>
    </div>
  );
}

function DropdownTrigger({ label, active }) {
  return (
    <span tabIndex={0} className={`public-nav-link cursor-default${active ? ' is-active' : ''}`}>
      {label}
      <Icon icon="mdi:chevron-down" className="public-nav-chevron size-4" />
    </span>
  );
}

export function MegaDropdown({ item, unitSlug, alignRight }) {
  const { pathname, search } = useLocation();
  const wide = (item.children?.length || 0) > 3;

  return (
    <div className="group relative">
      <DropdownTrigger label={item.label} active={isMenuItemActive(item, unitSlug, pathname, search)} />
      <DropdownPanel alignRight={alignRight} wide={wide}>
        {item.children.map((child) => (
          <MenuLink
            key={child.id}
            item={child}
            unitSlug={unitSlug}
            className={`public-dropdown-item${isMenuItemActive(child, unitSlug, pathname, search) ? ' is-active' : ''}`}
          />
        ))}
      </DropdownPanel>
    </div>
  );
}

export function UnitsDropdown({ entries, alignRight }) {
  const { pathname } = useLocation();

  return (
    <div className="group relative">
      <DropdownTrigger label="Unit" active={entries.some((entry) => isHrefActive(entry.to, pathname))} />
      <DropdownPanel alignRight={alignRight}>
        {entries.map((entry) => (
          <Link
            key={entry.key}
            to={entry.to}
            className={`public-dropdown-item${isHrefActive(entry.to, pathname) ? ' is-active' : ''}`}
          >
            {entry.label}
          </Link>
        ))}
      </DropdownPanel>
    </div>
  );
}
