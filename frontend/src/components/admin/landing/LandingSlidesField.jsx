import { SortableList } from '../../common/SortableList';
import { Icon } from '../../ui/Icon';

export function LandingSlidesField({ slides, onChange, onPickMedia }) {
  function updateSlide(id, patch) {
    onChange(slides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">Gambar latar hero</p>
          <p className="text-xs text-base-content/60">Setiap slide menjadi background penuh di beranda. Urutan bisa diubah.</p>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() =>
            onChange([
              ...slides,
              { id: `new-${Date.now()}`, mediaId: null, title: '', caption: '', linkUrl: '', previewUrl: '' },
            ])
          }
        >
          Tambah gambar
        </button>
      </div>
      {slides.length ? (
        <SortableList
          items={slides}
          onReorder={onChange}
          renderItem={(slide) => (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                {slide.previewUrl ? (
                  <img src={slide.previewUrl} alt="" className="h-16 w-28 rounded-md object-cover" />
                ) : (
                  <div className="flex h-16 w-28 items-center justify-center rounded-md bg-base-200 text-xs text-base-content/50">
                    Latar
                  </div>
                )}
                <input
                  className="input input-sm min-w-40 flex-1"
                  placeholder="Judul di atas gambar"
                  value={slide.title || ''}
                  onChange={(event) => updateSlide(slide.id, { title: event.target.value })}
                />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => onPickMedia(slide.id)}>
                  Pilih gambar
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-square btn-sm"
                  aria-label="Hapus slide"
                  onClick={() => onChange(slides.filter((item) => item.id !== slide.id))}
                >
                  <Icon icon="mdi:trash-can-outline" className="size-4" />
                </button>
              </div>
              <input
                className="input input-sm w-full"
                placeholder="Keterangan (opsional)"
                value={slide.caption || ''}
                onChange={(event) => updateSlide(slide.id, { caption: event.target.value })}
              />
            </div>
          )}
        />
      ) : (
        <p className="text-sm text-base-content/60">Belum ada gambar latar. Kalau kosong, hero memakai foto pengumuman unggulan.</p>
      )}
    </div>
  );
}
