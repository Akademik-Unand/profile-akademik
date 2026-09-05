import { createContext, useContext, useState } from 'react';
import { Icon } from '../components/ui/Icon';

const DrawerQueryContext = createContext('');

export function useDrawerQuery() {
  return useContext(DrawerQueryContext);
}

/**
 * Kotak cari di atas daftar blok Puck.
 */
export function BuilderDrawer({ children }) {
  const [query, setQuery] = useState('');

  return (
    <DrawerQueryContext.Provider value={query}>
      <label className="builder-drawer-search mb-2 flex items-center gap-2 rounded-md border border-base-300 bg-base-100 px-2">
        <Icon icon="mdi:magnify" className="size-4 shrink-0 text-base-content/50" />
        <input
          type="search"
          className="input input-ghost input-sm h-8 min-w-0 flex-1 border-0 px-0 focus:outline-none"
          placeholder="Cari blok"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Cari blok"
        />
      </label>
      {children}
    </DrawerQueryContext.Provider>
  );
}
