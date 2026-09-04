import { Icon } from '../ui/Icon';
import { AccessibilityMenu } from '../common/AccessibilityMenu';

/**
 * Strip di atas navbar: tautan media sosial + kemudahan tampilan.
 */
export function SiteTopBar({ links = [] }) {
  return (
    <div className="public-topbar bg-primary text-white">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-end gap-1 px-4 md:h-14 md:px-6">
        {links.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className="inline-flex size-10 items-center justify-center text-white hover:text-white/80"
          >
            <Icon icon={item.icon} className="size-5" />
          </a>
        ))}
        <AccessibilityMenu variant="public" />
      </div>
    </div>
  );
}
