import { BLOCK_TYPES, BUILDER_BLOCK_LABELS, BUILDER_BLOCK_META } from '../constants/builder';
import { editorMinHeight, showEditorChrome } from './builderChrome';

describe('showEditorChrome', () => {
  it('is true only while Puck is editing', () => {
    expect(showEditorChrome({ isEditing: true })).toBe(true);
    expect(showEditorChrome({ isEditing: false })).toBe(false);
    expect(showEditorChrome(undefined)).toBe(false);
  });
});

describe('editorMinHeight', () => {
  it('adds minHeight only in the editor when height is unset', () => {
    expect(editorMinHeight({}, { isEditing: true }, '16rem')).toEqual({ minHeight: '16rem' });
    expect(editorMinHeight({ height: '80px' }, { isEditing: true }, '16rem')).toEqual({ height: '80px' });
    expect(editorMinHeight({}, { isEditing: false }, '16rem')).toEqual({});
  });
});

describe('BUILDER_BLOCK_LABELS', () => {
  it('names every registered block type', () => {
    expect(BLOCK_TYPES.every((type) => BUILDER_BLOCK_LABELS[type])).toBe(true);
  });
});

describe('BUILDER_BLOCK_META', () => {
  it('gives every block an icon and a description', () => {
    expect(
      BLOCK_TYPES.every((type) => BUILDER_BLOCK_META[type]?.icon && BUILDER_BLOCK_META[type]?.description),
    ).toBe(true);
  });
});
