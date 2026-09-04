import { Icon } from '../../ui/Icon';

export function EditorToolbarButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`btn btn-ghost btn-xs btn-square ${active ? 'btn-active' : ''}`}
      onClick={onClick}
    >
      <Icon icon={icon} className="size-4" />
    </button>
  );
}
