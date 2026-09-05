import { LAYOUT_POSITIONS } from '../../constants/layoutBox';

/**
 * Mode alur: mengalir, geser, bebas, nempe.
 */
export function PositionField({ value = {}, onChange, defaultPosition = 'static' }) {
  const position = value.position || defaultPosition;
  const current = LAYOUT_POSITIONS.find((item) => item.value === position);

  return (
    <div className="space-y-1">
      <select
        className="select select-xs w-full"
        value={position}
        onChange={(event) => onChange({ ...value, position: event.target.value })}
        aria-label="Mode posisi"
      >
        {LAYOUT_POSITIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {current?.hint ? <p className="text-[11px] leading-4 text-base-content/55">{current.hint}</p> : null}
    </div>
  );
}
