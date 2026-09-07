import { useMemo, useState } from 'react';
import { Icon } from '../ui/Icon';
import { useAdminMedia, useUploadMedia } from '../../hooks/useCms';
import { resolveMediaSrc } from '../../helpers/mediaUrl';
import { useAuthStore } from '../../store/auth.store';

/**
 * Modal galeri untuk memilih atau mengunggah gambar.
 * @param {{ open: boolean, onClose: () => void, onSelect: (media: object) => void, unitId?: number|string, site?: 'main' }} props
 */
export function MediaLibraryModal({ open, onClose, onSelect, unitId, site }) {
  const user = useAuthStore((s) => s.user);
  const isMainSite = site === 'main' || (!unitId && !site && user?.role === 'superadmin');
  const resolvedUnit = isMainSite ? undefined : unitId || user?.units?.[0]?.id;
  const query = useMemo(
    () => (isMainSite ? { limit: 50, site: 'main' } : { limit: 50, unitId: resolvedUnit }),
    [isMainSite, resolvedUnit],
  );
  const { data, isLoading } = useAdminMedia(query, { enabled: open });
  const upload = useUploadMedia();
  const [altText, setAltText] = useState('');

  if (!open) return null;

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    if (!isMainSite && resolvedUnit) form.append('unitId', String(resolvedUnit));
    if (altText) form.append('altText', altText);
    await upload.mutateAsync(form);
    event.target.value = '';
  }

  return (
    <dialog className="modal modal-open z-[10050]">
      <div className="modal-box max-w-3xl">
        <h3 className="text-lg font-medium">Pilih media</h3>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <input className="input input-sm" placeholder="Teks alt (opsional)" value={altText} onChange={(e) => setAltText(e.target.value)} />
          <label className="btn btn-sm">
            <Icon icon="mdi:upload" className="size-4" />
            Unggah
            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFile} />
          </label>
        </div>
        <div className="mt-4 grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
          {isLoading ? <div className="skeleton col-span-4 h-32" /> : null}
          {!isLoading && !(data?.items || []).length ? (
            <p className="col-span-4 text-sm text-base-content/60">Belum ada media di lingkup ini.</p>
          ) : null}
          {(data?.items || []).map((item) => {
            const src = resolveMediaSrc(item.thumbnailUrl || item.url);
            return (
              <button
                key={item.id}
                type="button"
                className="overflow-hidden rounded-md border border-base-300 text-left hover:border-primary"
                onClick={() => {
                  onSelect({ ...item, url: resolveMediaSrc(item.url) || item.url, thumbnailUrl: src || item.thumbnailUrl });
                  onClose();
                }}
              >
                {item.mimeType?.startsWith('image/') && src ? (
                  <img src={src} alt={item.altText || item.filename} className="h-24 w-full object-cover" />
                ) : (
                  <div className="flex h-24 items-center justify-center text-xs">{item.filename}</div>
                )}
                <p className="truncate px-2 py-1 text-[11px]">{item.filename}</p>
              </button>
            );
          })}
        </div>
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
