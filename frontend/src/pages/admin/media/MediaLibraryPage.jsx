import { useState } from 'react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { Icon } from '../../../components/ui/Icon';
import { ConfirmDeleteModal } from '../../../components/common/ConfirmDeleteModal';
import { useAdminMedia, useDeleteMedia, useUploadMedia } from '../../../hooks/useCms';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import { useAuthStore } from '../../../store/auth.store';

export default function MediaLibraryPage() {
  const user = useAuthStore((s) => s.user);
  const [unitId, setUnitId] = useState(user?.role === 'superadmin' ? '' : user?.units?.[0]?.id);
  const { data, isLoading } = useAdminMedia(
    unitId ? { limit: 50, unitId } : { limit: 50, ...(user?.role === 'superadmin' ? { site: 'main' } : {}) },
  );
  const upload = useUploadMedia();
  const remove = useDeleteMedia();
  const confirmDelete = useConfirmDelete({ onConfirm: (row) => remove.mutateAsync(row.id) });

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    if (unitId) form.append('unitId', String(unitId));
    await upload.mutateAsync(form);
    event.target.value = '';
  }

  return (
    <div>
      <PageHeader
        title="Galeri"
        subtitle="Media terpusat untuk halaman dan pengumuman."
        breadcrumbs={[{ label: 'Galeri' }]}
        action={
          <div className="flex items-center gap-2">
            <div className="w-48">
              <UnitSelect value={unitId} onChange={setUnitId} />
            </div>
            <label className="btn btn-primary">
              <Icon icon="mdi:upload" className="size-4" />
              Unggah
              <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} />
            </label>
          </div>
        }
      />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(data?.items || []).map((item) => (
            <article key={item.id} className="overflow-hidden rounded-md border border-base-300 bg-base-100">
              {item.mimeType?.startsWith('image/') ? (
                <img src={item.thumbnailUrl || item.url} alt={item.altText || item.filename} className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center px-2 text-center text-xs">{item.filename}</div>
              )}
              <div className="flex items-center justify-between gap-2 p-2">
                <p className="truncate text-xs">{item.filename}</p>
                <button type="button" className="btn btn-ghost btn-square btn-xs" onClick={() => confirmDelete.open(item)} aria-label="Hapus">
                  <Icon icon="mdi:trash-can-outline" className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {!isLoading && !data?.items?.length ? <p className="text-sm text-base-content/60">Belum ada file.</p> : null}
      <ConfirmDeleteModal
        open={confirmDelete.isOpen}
        title="Hapus media"
        message={confirmDelete.target ? `Hapus “${confirmDelete.target.filename}”?` : undefined}
        isSubmitting={confirmDelete.isSubmitting}
        onConfirm={confirmDelete.confirm}
        onClose={confirmDelete.close}
      />
    </div>
  );
}
