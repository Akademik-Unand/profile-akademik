import { Link } from 'react-router-dom';
import { menuHref } from '../../helpers/menuHref';

export function MenuLink({ item, unitSlug, className, onClick }) {
  const href = menuHref(item, unitSlug);
  const external = Boolean(href?.startsWith('http'));

  if (external) {
    return (
      <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }

  return (
    <Link to={href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}
