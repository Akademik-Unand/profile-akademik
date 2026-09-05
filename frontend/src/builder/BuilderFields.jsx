import { createContext, useContext, useState } from 'react';
import { showPuckField } from '../helpers/fieldPanel';
import { Icon } from '../components/ui/Icon';

const FieldPanelContext = createContext({ query: '' });

export function useFieldPanel() {
  return useContext(FieldPanelContext);
}

/**
 * Panel kanan: satu daftar pengaturan plus kotak cari.
 */
export function BuilderFields({ children }) {
  const [query, setQuery] = useState('');

  return (
    <FieldPanelContext.Provider value={{ query }}>
      <div className="builder-fields-wrap">
        <div className="builder-fields-chrome">
          <label className="flex items-center gap-2 rounded-md border border-base-300 bg-base-100 px-2">
            <Icon icon="mdi:magnify" className="size-4 shrink-0 text-base-content/50" />
            <input
              type="search"
              className="input input-ghost input-sm h-8 min-w-0 flex-1 border-0 px-0 focus:outline-none"
              placeholder="Cari pengaturan"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Cari pengaturan"
            />
          </label>
        </div>
        <div className="builder-fields-body">{children}</div>
      </div>
    </FieldPanelContext.Provider>
  );
}

export function BuilderFieldLabel({ children, label }) {
  const { query } = useFieldPanel();
  const visible = showPuckField(label, query);
  return (
    <div
      className={visible ? 'builder-field' : undefined}
      data-field-label={label || ''}
      data-builder-field-hidden={visible ? undefined : 'true'}
      hidden={!visible}
    >
      {visible && label && label !== 'Gaya' && label !== 'Rata' ? (
        <p className="builder-field-name mb-1 text-xs text-base-content/60">{label}</p>
      ) : null}
      {children}
    </div>
  );
}
