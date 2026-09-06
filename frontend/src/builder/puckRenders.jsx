import { BUILDER_BLOCK_LABELS, slotFields } from '../constants/builder';
import {
  AccordionBlock,
  ButtonBlock,
  EmbedBlock,
  GalleryBlock,
  ImageBlock,
  QuoteBlock,
  RichTextBlock,
  StatsBlock,
} from './blocks/content';
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
import {
  AgendaListBlock,
  AnnouncementsBlock,
  ClosingCtaBlock,
  HeroBlock,
  IntroBlock,
  NewsFeedBlock,
  ServicesBlock,
  UnitDirectoryBlock,
} from './blocks/dynamic';
import { AgendaArchiveBlock, CategoryFeedBlock, OrganizationTreeBlock, PostArchiveBlock } from './blocks/archives';
import { DataFieldBlock } from './blocks/DataField';
import { DynamicCollectionBlock } from './blocks/DynamicCollection';
import { BlockFrame } from './blocks/BlockFrame';
import { PageRoot } from './blocks/PageRoot';
import { registerBlockRenders } from './blockRegistry';

const renders = {
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
  Gallery: GalleryBlock,
  Button: ButtonBlock,
  Quote: QuoteBlock,
  Accordion: AccordionBlock,
  Embed: EmbedBlock,
  Stats: StatsBlock,
  Hero: HeroBlock,
  Intro: IntroBlock,
  Services: ServicesBlock,
  NewsFeed: NewsFeedBlock,
  Announcements: AnnouncementsBlock,
  AgendaList: AgendaListBlock,
  UnitDirectory: UnitDirectoryBlock,
  ClosingCta: ClosingCtaBlock,
  OrganizationTree: OrganizationTreeBlock,
  PostArchive: PostArchiveBlock,
  AgendaArchive: AgendaArchiveBlock,
  CategoryFeed: CategoryFeedBlock,
  DataField: DataFieldBlock,
  DynamicCollection: DynamicCollectionBlock,
};

registerBlockRenders(renders);

function withBlockFrame(type, Render) {
  function Framed(props) {
    return (
      <BlockFrame puck={props.puck} label={BUILDER_BLOCK_LABELS[type]}>
        <Render {...props} />
      </BlockFrame>
    );
  }
  Framed.displayName = `${type}Frame`;
  return Framed;
}

export const puckRenders = Object.fromEntries(
  Object.entries(renders).map(([type, Render]) => [type, withBlockFrame(type, Render)]),
);

export const puckRenderConfig = {
  components: Object.fromEntries(
    Object.entries(puckRenders).map(([type, render]) => [type, { render, fields: slotFields(type) }]),
  ),
  root: { render: PageRoot },
};
