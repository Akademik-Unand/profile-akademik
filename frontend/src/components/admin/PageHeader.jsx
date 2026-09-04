import { Breadcrumb } from '../common/Breadcrumb';

/**
 * Judul halaman admin + breadcrumb + aksi kanan.
 * @param {{ title?: string, subtitle?: string, breadcrumbs?: Array<{ label: string, path?: string }>, action?: import('react').ReactNode }} props
 */
export function PageHeader({ title, subtitle, breadcrumbs = [], action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className={title ? 'mb-2' : ''}>
          <Breadcrumb items={breadcrumbs} />
        </div>
        {title ? <h1 className="text-xl font-medium tracking-tight md:text-2xl">{title}</h1> : null}
        {subtitle ? <p className="mt-1 text-sm text-base-content/70">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
