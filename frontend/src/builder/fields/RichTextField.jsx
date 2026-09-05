import { RichTextEditor } from '../../components/common/RichTextEditor';

export function RichTextField({ value, onChange }) {
  return (
    <div className="max-w-none">
      <RichTextEditor value={value || ''} onChange={onChange} />
    </div>
  );
}
