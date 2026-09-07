import { useState } from 'react';
import { MediaLibraryModal } from '../../components/common/MediaLibraryModal';
import { resolveMediaSrc } from '../../helpers/mediaUrl';
import { useBuilderRuntime } from '../BuilderRuntime';

export function MediaField({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const { unit, unitSlug } = useBuilderRuntime();
  const isMainSite = !unitSlug || unit?.isDefault;
  const preview = resolveMediaSrc(value?.url);

  return (
    <div>
      {preview ? <img src={preview} alt="" className="mb-2 h-24 w-full rounded-md object-cover" /> : null}
      <button type="button" className="btn btn-sm btn-outline" onClick={() => setOpen(true)}>
        {preview ? 'Ganti gambar' : 'Pilih gambar'}
      </button>
      {preview ? (
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => onChange(null)}>
          Hapus
        </button>
      ) : null}
      <MediaLibraryModal
        open={open}
        site={isMainSite ? 'main' : undefined}
        unitId={isMainSite ? undefined : unit?.id}
        onClose={() => setOpen(false)}
        onSelect={(media) => {
          onChange({ mediaId: media.id, url: resolveMediaSrc(media.url) || media.url, caption: media.altText || '' });
          setOpen(false);
        }}
      />
    </div>
  );
}
