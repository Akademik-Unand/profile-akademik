import { Link } from 'react-router-dom';
import { Can } from '../../policies/AbilityContext';
import { ROUTES } from '../../constants/routes';

export function DashboardUnitsCard({ units = [] }) {
  return (
    <section className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-sm font-medium">Unit yang dikelola</h2>
        {units.length ? (
          <ul className="list-disc pl-5 text-sm">
            {units.map((unit) => (
              <li key={unit.id}>
                {unit.name}
                {unit.isDefault ? <span className="ml-2 text-xs text-base-content/50">default</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-base-content/70">Belum ada unit yang ditugaskan.</p>
        )}
        <Can I="manage" a="Unit">
          <div className="card-actions">
            <Link to={ROUTES.adminUnits} className="btn btn-primary btn-sm">
              Kelola unit
            </Link>
          </div>
        </Can>
      </div>
    </section>
  );
}
