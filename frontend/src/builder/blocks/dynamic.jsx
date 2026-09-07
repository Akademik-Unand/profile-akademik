import { HeroCarousel } from '../../components/public/HeroCarousel';
import { ServiceTiles } from '../../components/public/ServiceTiles';
import { IntroSection } from '../../components/public/IntroSection';
import { FeaturedNews } from '../../components/public/FeaturedNews';
import { Announcements } from '../../components/public/Announcements';
import { AgendaSection } from '../../components/public/AgendaSection';
import { UnitDirectory } from '../../components/public/UnitDirectory';
import { ClosingCta } from '../../components/public/ClosingCta';
import { usePublicAgendas, usePublicPosts } from '../../hooks/useCms';
import { usePublicUnits } from '../../hooks/useUnits';
import { useBuilderSlugs } from '../../hooks/useBuilderSlugs';
import { showEditorChrome } from '../../helpers/builderChrome';
import { BlockPlaceholder } from './placeholder';
import { DataBlockFrame } from './DataBlockFrame';
import { DataBlockState } from './DataBlockState';
import { motionAttrs } from '../../helpers/blockMotion';
import { DataLoop } from './DataLoop';
import { SAMPLE_AGENDAS } from '../../constants/dataDisplay';
import { AgendaList } from '../../components/public/AgendaList';

export function HeroBlock({ eyebrow, title, subtitle, ctaLabel, ctaUrl, slides = [], motion }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const featured = usePublicPosts(apiSlug, {
    limit: 5,
    featured: true,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const landing = {
    eyebrow,
    heroTitle: title,
    heroSubtitle: subtitle,
    ctaLabel,
    ctaUrl,
    slides: slides.map((slide, index) => ({
      id: slide.mediaId || index,
      mediaId: slide.mediaId,
      title: slide.title,
      caption: slide.caption,
      linkUrl: slide.linkUrl,
      media: slide.image?.url || slide.url ? { url: slide.image?.url || slide.url } : null,
    })),
  };
  const posts = ready ? featured.data?.items || [] : [];
  return (
    <div {...motionAttrs(motion)}>
      <HeroCarousel landing={landing} posts={posts} unitSlug={pathSlug} overlap={false} />
    </div>
  );
}

export function ServicesBlock({ title, items = [], box, motion, puck }) {
  const { pathSlug } = useBuilderSlugs();
  if (!items.length && showEditorChrome(puck)) {
    return (
      <DataBlockFrame box={box} motion={motion} puck={puck}>
        <BlockPlaceholder label="Layanan — tambah tautan di panel kanan" />
      </DataBlockFrame>
    );
  }
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <ServiceTiles landing={{ servicesTitle: title, services: items }} unitSlug={pathSlug} />
    </DataBlockFrame>
  );
}

export function IntroBlock({ title, body, profileUrl, box, motion, puck }) {
  const { pathSlug } = useBuilderSlugs();
  if (!title && !body) {
    return (
      <DataBlockFrame box={box} motion={motion} puck={puck}>
        <BlockPlaceholder label="Pengantar — isi judul di panel kanan" />
      </DataBlockFrame>
    );
  }
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <IntroSection landing={{ introTitle: title, introBody: body }} unitSlug={pathSlug} profileUrl={profileUrl} />
    </DataBlockFrame>
  );
}

export function NewsFeedBlock({ title, limit, featuredOnly, box, motion, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const query = usePublicPosts(apiSlug, {
    limit: Number(limit) || 6,
    featured: featuredOnly === true || featuredOnly === 'true' ? true : undefined,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <DataBlockState puck={puck} ready={ready} query={query} emptyLabel="Berita — belum ada konten terbit di unit ini">
        <FeaturedNews posts={query.data?.items || []} unitSlug={pathSlug} title={title} />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function AnnouncementsBlock({ title, limit, category, box, motion, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const query = usePublicPosts(apiSlug, {
    limit: Number(limit) || 6,
    category: category || 'pengumuman',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <DataBlockState
        puck={puck}
        ready={ready}
        query={query}
        emptyLabel="Pengumuman — belum ada konten terbit untuk kategori ini"
      >
        <Announcements posts={query.data?.items || []} unitSlug={pathSlug} title={title} />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function AgendaListBlock({ id, item, title, limit, display, box, motion, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const query = usePublicAgendas(apiSlug, {
    limit: Number(limit) || 4,
    sortBy: 'startsAt',
    sortOrder: 'asc',
  });
  const items = query.data?.items || [];
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <DataBlockState
        puck={puck}
        ready={ready}
        query={query}
        emptyLabel="Agenda — belum ada agenda terbit di unit ini"
        emptyPreview={
          <DataLoop
            id={id}
            slot={item}
            items={SAMPLE_AGENDAS}
            source="agenda"
            pathSlug={pathSlug}
            display={display}
            puck={puck}
            fallback={<AgendaList items={SAMPLE_AGENDAS} display={display} />}
          />
        }
      >
        <DataLoop
          id={id}
          slot={item}
          items={items}
          source="agenda"
          pathSlug={pathSlug}
          display={display}
          puck={puck}
          fallback={<AgendaSection items={items} unitSlug={pathSlug} title={title} display={display} />}
        />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function UnitDirectoryBlock({ title, box, motion, puck }) {
  const query = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' });
  const units = (query.data?.items || []).filter((item) => !item.isDefault);
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <DataBlockState puck={puck} ready query={query} items={units} emptyLabel="Daftar unit — belum ada unit di bawah situs ini">
        <UnitDirectory units={query.data?.items || []} title={title} />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function ClosingCtaBlock({ title, body, ctaLabel, ctaUrl, box, motion, puck }) {
  const { unit, pathSlug } = useBuilderSlugs();
  return (
    <DataBlockFrame box={box} motion={motion} puck={puck}>
      <ClosingCta
        unit={unit}
        unitSlug={pathSlug}
        landing={{ contactTitle: title, contactBody: body, ctaLabel, ctaUrl }}
      />
    </DataBlockFrame>
  );
}
