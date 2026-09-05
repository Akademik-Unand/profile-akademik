import { slotFields } from '../constants/builder';
import {
  BandBlock,
  CardBlock,
  ColumnsBlock,
  DividerBlock,
  HeadingBlock,
  SectionBlock,
  SpacerBlock,
  SplitBlock,
} from './blocks/layout';
import { ButtonBlock, ImageBlock, QuoteBlock, RichTextBlock } from './blocks/content';
import { DataFieldBlock } from './blocks/DataField';

export const itemRenders = {
  Section: SectionBlock,
  Card: CardBlock,
  Band: BandBlock,
  Columns: ColumnsBlock,
  Columns3: ColumnsBlock,
  Split: SplitBlock,
  Spacer: SpacerBlock,
  Divider: DividerBlock,
  Heading: HeadingBlock,
  RichText: RichTextBlock,
  Image: ImageBlock,
  Button: ButtonBlock,
  Quote: QuoteBlock,
  DataField: DataFieldBlock,
};

export const itemTemplateConfig = {
  components: Object.fromEntries(
    Object.entries(itemRenders).map(([type, render]) => [type, { render, fields: slotFields(type) }]),
  ),
  root: { render: ({ children }) => children },
};
