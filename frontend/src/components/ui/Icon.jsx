import { Icon as IconifyIcon } from '@iconify/react';

export function Icon({ icon, className = 'size-5', ...props }) {
  return <IconifyIcon icon={icon} className={className} {...props} />;
}
