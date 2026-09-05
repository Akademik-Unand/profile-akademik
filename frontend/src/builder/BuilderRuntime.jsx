import { createContext, useContext } from 'react';

const BuilderRuntimeContext = createContext({
  unitSlug: '',
  unit: null,
  preview: false,
  document: null,
});

export function BuilderRuntimeProvider({ unitSlug = '', unit = null, preview = false, document = null, children }) {
  return (
    <BuilderRuntimeContext.Provider value={{ unitSlug, unit, preview, document }}>{children}</BuilderRuntimeContext.Provider>
  );
}

export function useBuilderRuntime() {
  return useContext(BuilderRuntimeContext);
}
