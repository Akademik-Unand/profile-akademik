import { AdminField } from '../admin/AdminField';
import { ROLE_LABELS } from '../../constants/roles';

/**
 * Form create/edit pengguna: nama, email, password, peran, unit.
 */
export function UserFormFields({ register, errors, units = [], selectedUnitIds = [], onToggleUnit, isEdit }) {
  return (
    <>
      <AdminField label="Nama" error={errors.name?.message}>
        <input className="input w-full" {...register('name')} />
      </AdminField>
      <AdminField label="Email" error={errors.email?.message}>
        <input type="email" className="input w-full" autoComplete="off" {...register('email')} />
      </AdminField>
      <AdminField label={isEdit ? 'Password baru (opsional)' : 'Password'} error={errors.password?.message}>
        <input type="password" className="input w-full" autoComplete="new-password" {...register('password')} />
      </AdminField>
      <AdminField label="Peran" error={errors.role?.message}>
        <select className="select w-full" {...register('role')}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </AdminField>
      <AdminField label="Unit">
        <div className="flex flex-col gap-2 rounded-md border border-base-300 p-3">
          {units.length ? (
            units.map((unit) => (
              <label key={unit.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedUnitIds.includes(unit.id)}
                  onChange={() => onToggleUnit(unit.id)}
                />
                {unit.name}
              </label>
            ))
          ) : (
            <p className="text-sm text-base-content/60">Belum ada unit.</p>
          )}
        </div>
      </AdminField>
    </>
  );
}
