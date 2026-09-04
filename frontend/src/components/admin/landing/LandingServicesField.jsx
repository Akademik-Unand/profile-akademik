import { SortableList } from '../../common/SortableList';
import { Icon } from '../../ui/Icon';
import { SERVICE_ICONS } from '../../../helpers/landingBlocks';

export function LandingServicesField({ services, onChange }) {
  function updateItem(id, patch) {
    onChange(services.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">Layanan</p>
          <p className="text-xs text-base-content/60">Tile di beranda. Bisa ke halaman internal atau URL luar.</p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() =>
            onChange([
              ...services,
              { id: `new-${Date.now()}`, label: '', icon: 'mdi:link-variant', url: '' },
            ])
          }
        >
          Tambah layanan
        </button>
      </div>
      {services.length ? (
        <SortableList
          items={services}
          onReorder={onChange}
          renderItem={(item) => (
            <div className="grid gap-2 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.2fr)_auto]">
              <select
                className="select select-sm"
                value={item.icon || 'mdi:link-variant'}
                onChange={(event) => updateItem(item.id, { icon: event.target.value })}
              >
                {SERVICE_ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
              <input
                className="input input-sm"
                placeholder="Label"
                value={item.label || ''}
                onChange={(event) => updateItem(item.id, { label: event.target.value })}
              />
              <input
                className="input input-sm"
                placeholder="/halaman/profil atau https://"
                value={item.url || ''}
                onChange={(event) => updateItem(item.id, { url: event.target.value })}
              />
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Hapus layanan"
                onClick={() => onChange(services.filter((row) => row.id !== item.id))}
              >
                <Icon icon="mdi:trash-can-outline" className="size-4" />
              </button>
            </div>
          )}
        />
      ) : (
        <p className="text-sm text-base-content/60">Belum ada layanan. Kalau kosong, beranda memakai tile bawaan.</p>
      )}
    </div>
  );
}
