import { AdminField } from '../admin/AdminField';

export function DynamicEntryFields({ fields = [], register, errors }) {
  return fields.map((field) => {
    const props = register(field.key);
    let input = <input className="input w-full" type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'datetime' ? 'datetime-local' : field.type === 'url' ? 'url' : 'text'} {...props} />;
    if (['textarea', 'richtext'].includes(field.type)) input = <textarea className="textarea w-full" rows={field.type === 'richtext' ? 8 : 3} {...props} />;
    if (field.type === 'boolean') input = <input type="checkbox" className="checkbox checkbox-primary" {...props} />;
    if (field.type === 'select') input = <select className="select w-full" {...props}><option value="">Pilih...</option>{(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}</select>;
    if (field.type === 'multiselect') input = <select multiple className="select h-28 w-full" {...props}>{(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}</select>;
    if (field.type === 'media') input = <input className="input w-full" type="number" min="1" placeholder="ID media" {...props} />;
    return <AdminField key={field.key} label={field.label} error={errors?.[field.key]?.message}>{input}</AdminField>;
  });
}
