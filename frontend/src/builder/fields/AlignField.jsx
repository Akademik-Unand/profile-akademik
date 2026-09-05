import { ALIGN_OPTIONS } from '../../constants/builder';
import { showPuckField } from '../../helpers/fieldPanel';
import { Icon } from '../../components/ui/Icon';
import { useFieldPanel } from '../BuilderFields';

/**
 * Rata teks: kiri, tengah, kanan, rata kiri-kanan.
 */
export function AlignField({ value, onChange, options = ALIGN_OPTIONS }) {
  const { query } = useFieldPanel();
  const items = ALIGN_OPTIONS.filter((item) => options.some((option) => (option.value || option) === item.value));
  if (!showPuckField('Rata', query)) return <div data-builder-field-hidden hidden />;

  return (
    <div className="builder-field">
      <p className="mb-1 text-xs text-base-content/60">Rata teks</p>
      <div className="flex rounded-md border border-base-300 p-0.5">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`btn btn-ghost btn-xs flex-1 ${value === item.value ? 'btn-active' : ''}`}
            title={item.label}
            aria-label={item.label}
            onClick={() => onChange(item.value)}
          >
            <Icon icon={item.icon} className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
