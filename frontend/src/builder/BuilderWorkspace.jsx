import { Link } from 'react-router-dom';
import { useUiStore } from '../store/ui.store';

/**
 * Ruang kerja builder fullscreen — di luar AdminLayout.
 */
export function BuilderWorkspace({
  title,
  subtitle,
  backTo,
  previewHref,
  onSave,
  saving = false,
  extraActions,
  children,
}) {
  const theme = useUiStore((state) => state.theme);

  return (
    <div id="admin-app" data-theme={theme} className="flex h-svh flex-col overflow-hidden bg-base-200 text-base-content">
      <header className="relative z-20 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-base-300 bg-base-100 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{title}</p>
          {subtitle ? <p className="mt-0.5 truncate text-xs leading-tight text-base-content/50">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {extraActions}
          <button type="button" className="btn btn-primary btn-sm" disabled={saving} onClick={onSave}>
            Simpan
          </button>
          {previewHref ? (
            <a className="btn btn-ghost btn-sm" href={previewHref} target="_blank" rel="noreferrer">
              Pratinjau
            </a>
          ) : null}
          <Link className="btn btn-ghost btn-sm" to={backTo}>
            Kembali
          </Link>
        </div>
      </header>
      <div className="relative z-0 min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
