import { Render } from '@puckeditor/core';
import { puckRenderConfig } from './puckRenders';
import { safeBuilderDocument } from '../helpers/builderDocument';
import { motionRevision } from '../helpers/blockMotion';
import { useAosRefresh } from '../helpers/aosInit';
import { BuilderRuntimeProvider } from './BuilderRuntime';

function BuilderAosRefresh({ revision, children }) {
  useAosRefresh(revision);
  return children;
}

export function BuilderRender({ document, unit, unitSlug }) {
  const data = safeBuilderDocument(document);
  if (!data.content.length) return null;
  return (
    <BuilderRuntimeProvider unit={unit} unitSlug={unitSlug} document={data}>
      <BuilderAosRefresh revision={motionRevision(data)}>
        <Render config={puckRenderConfig} data={data} />
      </BuilderAosRefresh>
    </BuilderRuntimeProvider>
  );
}
