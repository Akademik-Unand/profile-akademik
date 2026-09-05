import { useState } from 'react';
import { MediaLibraryModal } from '../../components/common/MediaLibraryModal';
import { useBuilderRuntime } from '../BuilderRuntime';

export function MediaField({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const { unit } = useBuilderRuntime();

  return (
    <div>
      {value?.url ? <img src={value.url} alt="" className="mb-2 h-24 w-full rounded-md object-cover" /> : null}
      <button type="button" className="btn btn-sm btn-outline" onClick={() => setOpen(true)}>
        {value?.url ? 'Ganti gambar' : 'Pilih gambar'}
      </button>
      {value?.url ? (
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => onChange(null)}>
          Hapus
        </button>
      ) : null}
      <MediaLibraryModal
        open={open}
        unitId={unit?.id}
        onClose={() => setOpen(false)}
        onSelect={(media) => {
          onChange({ mediaId: media.id, url: media.url, caption: media.altText || '' });
          setOpen(false);
        }}
      />
    </div>
  );
}
