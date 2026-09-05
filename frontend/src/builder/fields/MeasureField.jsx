import { LAYOUT_UNITS, WIDTH_UNITS, emptyMeasure } from '../../constants/layoutBox';

/**
 * Satu nilai plus satuan (lebar, tinggi, jarak).
 */
export function MeasureField({ value, onChange, allowAuto = false, units: unitsProp, label }) {
  const measure = { ...emptyMeasure(), ...value };
  const units = unitsProp || (allowAuto ? WIDTH_UNITS : LAYOUT_UNITS);

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="input input-sm w-24"
        disabled={measure.unit === 'auto'}
        value={measure.unit === 'auto' ? '' : measure.value}
        onChange={(event) => onChange({ ...measure, value: event.target.value })}
        aria-label={label || 'Nilai'}
      />
      <select
        className="select select-sm w-24"
        value={measure.unit}
        onChange={(event) => onChange({ ...measure, unit: event.target.value })}
        aria-label="Satuan"
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  );
}
