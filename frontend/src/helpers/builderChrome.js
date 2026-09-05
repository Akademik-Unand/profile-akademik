/**
 * Chrome editor hanya saat Puck merender di <Puck>, bukan di <Render> publik.
 * @see https://puckeditor.com/docs/api-reference/configuration/component-config
 */
export function showEditorChrome(puck) {
  return puck?.isEditing === true;
}

/** Tinggi minimum di kanvas editor. */
export function editorMinHeight(style = {}, puck, minHeight) {
  if (!showEditorChrome(puck) || style.height) return style;
  return { ...style, minHeight: style.minHeight || minHeight };
}
