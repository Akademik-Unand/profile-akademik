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
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-base-300 bg-base-100 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{title}</p>
          {subtitle ? <p className="truncate text-xs text-base-content/50">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
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
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
