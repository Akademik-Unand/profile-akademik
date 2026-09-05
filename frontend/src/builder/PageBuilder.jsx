import { useEffect, useMemo, useState } from 'react';
import { createUsePuck, Puck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { puckConfig } from './puckConfig';
import { emptyBuilder } from '../helpers/builderDocument';
import { BuilderDrawer } from './BuilderDrawerFilter';
import { BuilderDrawerItem } from './BuilderDrawerItem';
import { BuilderFields, BuilderFieldLabel } from './BuilderFields';
import { BuilderRuntimeProvider } from './BuilderRuntime';

const usePuckAppData = createUsePuck();

function LiveDocumentSync({ liveRef, onDocument }) {
  const data = usePuckAppData((state) => state.appState?.data);
  if (data && liveRef) liveRef.current = data;
  useEffect(() => {
    if (data) onDocument?.(data);
  }, [data, onDocument]);
  return null;
}

/**
 * Kanvas Puck. `data` hanya dipakai saat mount / saat resetKey ganti —
 * jangan umpan ulang state tiap huruf, itu mereset overlay.
 */
export function PageBuilder({ data, onChange, onPublish, liveRef, unit, unitSlug, header, resetKey = 'canvas' }) {
  const seed = useMemo(() => data || emptyBuilder(), [resetKey]);
  const [document, setDocument] = useState(seed);
  useEffect(() => {
    setDocument(seed);
  }, [seed]);

  const overrides = useMemo(
    () => ({
      drawer: ({ children }) => <BuilderDrawer>{children}</BuilderDrawer>,
      drawerItem: ({ name }) => <BuilderDrawerItem name={name} />,
      fields: ({ children }) => (
        <>
          <LiveDocumentSync liveRef={liveRef} onDocument={setDocument} />
          <BuilderFields>{children}</BuilderFields>
        </>
      ),
      fieldLabel: ({ children, label }) => <BuilderFieldLabel label={label}>{children}</BuilderFieldLabel>,
      ...(header ? { headerActions: () => header } : {}),
    }),
    [header, liveRef],
  );

  function handleChange(next) {
    setDocument(next);
    if (liveRef) liveRef.current = next;
    onChange?.(next);
  }

  return (
    <BuilderRuntimeProvider unit={unit} unitSlug={unitSlug} preview document={document}>
      <div className="builder-canvas h-full min-h-0 bg-base-100">
        <Puck
          key={resetKey}
          config={puckConfig}
          data={seed}
          onChange={handleChange}
          onPublish={onPublish}
          height="100%"
          iframe={{ enabled: false }}
          dnd={{ behavior: 'static' }}
          ui={{ leftSideBarVisible: true, rightSideBarVisible: true }}
          dictionary={{
            'header-publish': 'Terbitkan',
            'plugin-blocks': 'Blok',
            'plugin-outline': 'Susunan',
          }}
          overrides={overrides}
        />
      </div>
    </BuilderRuntimeProvider>
  );
}
