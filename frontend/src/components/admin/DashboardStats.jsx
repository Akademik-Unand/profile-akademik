import { summarizeUnits } from '../../helpers/dashboardChart';

const ITEMS = [
  { key: 'total', label: 'Total unit' },
  { key: 'active', label: 'Aktif' },
  { key: 'inactive', label: 'Nonaktif' },
  { key: 'defaults', label: 'Unit default' },
];

export function DashboardStats({ units = [] }) {
  const stats = summarizeUnits(units);

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ITEMS.map((item) => (
        <div key={item.key} className="card bg-base-100 shadow-sm">
          <div className="card-body gap-1 py-4">
            <p className="text-xs text-base-content/60">{item.label}</p>
            <p className="text-2xl tracking-tight">{stats[item.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
