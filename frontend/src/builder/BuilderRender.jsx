import { Render } from '@puckeditor/core';
import { puckRenderConfig } from './puckRenders';
import { safeBuilderDocument } from '../helpers/builderDocument';
import { BuilderRuntimeProvider } from './BuilderRuntime';

export function BuilderRender({ document, unit, unitSlug }) {
  const data = safeBuilderDocument(document);
  if (!data.content.length) return null;
  return (
    <BuilderRuntimeProvider unit={unit} unitSlug={unitSlug} document={data}>
      <Render config={puckRenderConfig} data={data} />
    </BuilderRuntimeProvider>
  );
}
