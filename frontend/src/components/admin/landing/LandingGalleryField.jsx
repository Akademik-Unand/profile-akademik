import { SortableList } from '../../common/SortableList';
import { Icon } from '../../ui/Icon';

export function LandingGalleryField({ items, onChange, onPickMedia }) {
  function updateItem(id, patch) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function setFeatured(id) {
    const already = items.some((item) => item.id === id && item.featured);
    onChange(items.map((item) => ({ ...item, featured: already ? false : item.id === id })));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">Galeri</p>
          <p className="text-xs text-base-content/60">Foto kegiatan di beranda. Satu foto bisa ditandai unggulan untuk sel besar.</p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() =>
            onChange([...items, { id: `new-${Date.now()}`, mediaId: null, caption: '', featured: false, previewUrl: '' }])
          }
        >
          Tambah foto
        </button>
      </div>
      {items.length ? (
        <SortableList
          items={items}
          onReorder={onChange}
          renderItem={(item) => (
            <div className="flex flex-wrap items-center gap-3">
              {item.previewUrl ? (
                <img src={item.previewUrl} alt="" className="h-14 w-20 rounded-md object-cover" />
              ) : (
                <div className="flex h-14 w-20 items-center justify-center rounded-md bg-base-200 text-xs text-base-content/50">
                  Foto
                </div>
              )}
              <input
                className="input input-sm min-w-40 flex-1"
                placeholder="Keterangan (opsional)"
                value={item.caption || ''}
                onChange={(event) => updateItem(item.id, { caption: event.target.value })}
              />
              <label className="label cursor-pointer gap-2 px-0">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={Boolean(item.featured)}
                  onChange={() => setFeatured(item.id)}
                />
                <span className="text-xs">Unggulan</span>
              </label>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onPickMedia(item.id)}>
                Pilih gambar
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Hapus foto"
                onClick={() => onChange(items.filter((row) => row.id !== item.id))}
              >
                <Icon icon="mdi:trash-can-outline" className="size-4" />
              </button>
            </div>
          )}
        />
      ) : (
        <p className="text-sm text-base-content/60">Belum ada foto galeri.</p>
      )}
    </div>
  );
}
