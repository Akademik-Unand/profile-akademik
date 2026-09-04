import { BarChart } from '../common/BarChart';
import { DonutChart } from '../common/DonutChart';
import { unitStatusChart, unitTemplateChart } from '../../helpers/dashboardChart';

export function DashboardCharts({ units = [], theme }) {
  const status = unitStatusChart(units, theme);
  const templates = unitTemplateChart(units, theme);
  const empty = units.length === 0;

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm font-medium">Status unit</h2>
          {empty ? (
            <p className="py-12 text-center text-sm text-base-content/60">Belum ada data unit.</p>
          ) : (
            <DonutChart series={status.series} options={status.options} />
          )}
        </div>
      </section>
      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-sm font-medium">Unit per template</h2>
          {empty ? (
            <p className="py-12 text-center text-sm text-base-content/60">Belum ada data unit.</p>
          ) : (
            <BarChart series={templates.series} options={templates.options} />
          )}
        </div>
      </section>
    </div>
  );
}
