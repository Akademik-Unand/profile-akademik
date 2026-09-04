import { Icon } from './Icon';
import { Button } from './Button';

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-neutral-900/40" aria-label="Tutup" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-md bg-surface p-5 shadow-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-base font-medium text-neutral-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Tutup">
            <Icon icon="mdi:close" className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
