import { showEditorChrome } from '../../helpers/builderChrome';

/**
 * Label nama blok saja — tidak boleh jadi kotak tambahan.
 * Overlay Puck mengukur [data-puck-component]; wrapper extra bikin garis biru miss.
 */
export function BlockFrame({ puck, label, children }) {
  const editing = showEditorChrome(puck);
  if (!editing || !label) return children;
  return (
    <>
      <span className="builder-block-name">{label}</span>
      {children}
    </>
  );
}
