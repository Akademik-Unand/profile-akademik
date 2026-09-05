import { DATA_LAYOUTS } from '../../constants/dataDisplay';
import { showPuckField } from '../../helpers/fieldPanel';
import { useFieldPanel } from '../BuilderFields';

/**
 * Bentuk item data (daftar/kartu) plus field yang boleh tampil.
 */
export function DataDisplayField({ value = {}, onChange, fields = [] }) {
  const { query } = useFieldPanel();
  if (!showPuckField('Tampilan data', query)) return <div data-builder-field-hidden hidden />;

  const display = value && typeof value === 'object' ? value : {};

  return (
    <div className="builder-field space-y-3">
      <div>
        <p className="mb-1 text-xs text-base-content/60">Bentuk item</p>
        <div className="flex rounded-md border border-base-300 p-0.5">
          {DATA_LAYOUTS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn btn-ghost btn-xs flex-1 ${display.layout === item.value ? 'btn-active' : ''}`}
              onClick={() => onChange({ ...display, layout: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs text-base-content/60">Tampilkan</p>
        <div className="space-y-1.5">
          {fields.map((field) => (
            <label key={field.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={display[field.key] !== false}
                onChange={(event) => onChange({ ...display, [field.key]: event.target.checked })}
              />
              {field.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
