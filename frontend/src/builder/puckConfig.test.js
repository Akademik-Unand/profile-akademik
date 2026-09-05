import { BLOCK_TYPES, BUILDER_BLOCK_LABELS } from '../constants/builder';
import { puckConfig } from './puckConfig';

describe('puckConfig labels', () => {
  it('uses the documented Puck label for every block', () => {
    BLOCK_TYPES.forEach((type) => {
      expect(puckConfig.components[type].label).toBe(BUILDER_BLOCK_LABELS[type]);
    });
  });
});

describe('puckConfig box defaults', () => {
  it('gives Section visible padding and Heading a filled box', () => {
    expect(puckConfig.components.Section.defaultProps.box.padding.top).toBe(56);
    expect(puckConfig.components.Heading.defaultProps.box.padding.top).toBe(16);
    expect(puckConfig.components.Heading.defaultProps.box.width).toEqual({ value: 100, unit: '%' });
    expect(puckConfig.components.Spacer.defaultProps.box.height).toEqual({ value: 64, unit: 'px' });
    expect(puckConfig.components.Button.defaultProps.variant).toBe('outline');
    expect(puckConfig.components.Button.defaultProps.box.width.unit).toBe('auto');
    expect(puckConfig.components.Card.defaultProps.box.borderStyle).toBe('solid');
    expect(puckConfig.components.AgendaArchive.defaultProps.display.layout).toBe('list');
    expect(puckConfig.components.PostArchive.defaultProps.display.cover).toBe(false);
    expect(puckConfig.components.Heading.defaultProps.bind).toBe('');
    expect(puckConfig.components.DataField.defaultProps.field).toBe('title');
    expect(puckConfig.components.AgendaArchive.defaultProps.item).toEqual([]);
  });
});

