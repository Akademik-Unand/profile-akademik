import { useAdminUnits } from '../../hooks/useUnits';
import { useAuthStore } from '../../store/auth.store';

export function UnitSelect({ value, onChange, disabled, variant = 'form', className = '' }) {
  const user = useAuthStore((s) => s.user);
  const isSuper = user?.role === 'superadmin';
  const { data } = useAdminUnits({ limit: 100, sortBy: 'name', sortOrder: 'asc' }, { enabled: isSuper });

  if (!isSuper) return null;

  function handleChange(event) {
    const raw = event.target.value;
    if (raw === '' || raw === 'main') onChange(raw);
    else onChange(Number(raw));
  }

  const selectClass =
    variant === 'toolbar'
      ? `select select-sm w-44 max-w-[12rem] ${className}`.trim()
      : `select w-full ${className}`.trim();

  return (
    <select className={selectClass} value={value ?? ''} disabled={disabled} onChange={handleChange}>
      <option value="">{variant === 'filter' ? 'Semua' : 'Situs utama'}</option>
      {variant === 'filter' ? <option value="main">Situs utama</option> : null}
      {(data?.items || []).map((unit) => (
        <option key={unit.id} value={unit.id}>
          {unit.name}
        </option>
      ))}
    </select>
  );
}
