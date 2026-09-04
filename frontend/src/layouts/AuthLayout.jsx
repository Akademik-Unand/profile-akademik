import { useUiStore } from '../store/ui.store';

export function AuthLayout({ children, title, subtitle }) {
  const theme = useUiStore((state) => state.theme);

  return (
    <div id="admin-app" data-theme={theme} className="flex min-h-svh items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-sm">
        <div className="card-body">
          <img src="/images/unand.png" alt="Universitas Andalas" className="mb-2 h-16 w-16 object-contain" />
          <h1 className="card-title text-lg font-medium">{title}</h1>
          {subtitle ? <p className="text-sm text-base-content/70">{subtitle}</p> : null}
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
