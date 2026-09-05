import { Link } from 'react-router-dom';
import { OrganizationTree } from '../../components/public/OrganizationTree';
import { PostArchive } from '../../components/public/PostArchive';
import { AgendaList } from '../../components/public/AgendaList';
import { PostItems } from '../../components/public/PostItems';
import { ROUTES } from '../../constants/routes';
import { SAMPLE_AGENDAS, SAMPLE_POSTS } from '../../constants/dataDisplay';
import { usePublicAgendas, usePublicOrganization, usePublicPosts } from '../../hooks/useCms';
import { useBuilderSlugs } from '../../hooks/useBuilderSlugs';
import { DataBlockState } from './DataBlockState';
import { DataBlockFrame } from './DataBlockFrame';
import { DataLoop } from './DataLoop';
import { BlockPlaceholder } from './placeholder';
import { showEditorChrome } from '../../helpers/builderChrome';

export function OrganizationTreeBlock({ title, box, puck }) {
  const { apiSlug, ready } = useBuilderSlugs();
  const query = usePublicOrganization(apiSlug);
  return (
    <DataBlockFrame box={box} puck={puck}>
      {title ? <h2 className="mb-6 font-headline text-2xl text-neutral-900">{title}</h2> : null}
      <DataBlockState puck={puck} ready={ready} query={query} emptyLabel="Struktur organisasi — belum ada anggota di unit ini">
        <OrganizationTree members={query.data?.items || []} />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function PostArchiveBlock({ id, item, title, display, box, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  if (!ready) {
    return (
      <DataBlockFrame box={box} puck={puck}>
        {showEditorChrome(puck) ? (
          <BlockPlaceholder label="Arsip konten — unit belum siap" />
        ) : (
          <div className="skeleton h-64 w-full" />
        )}
      </DataBlockFrame>
    );
  }
  return (
    <DataBlockFrame box={box} puck={puck}>
      {title ? <h2 className="mb-6 font-headline text-2xl text-neutral-900">{title}</h2> : null}
      <PostArchive
        apiSlug={apiSlug}
        pathSlug={pathSlug}
        display={display}
        sampleItems={showEditorChrome(puck) ? SAMPLE_POSTS : undefined}
        renderItems={(items) => (
          <DataLoop
            id={id}
            slot={item}
            items={items}
            source="post"
            pathSlug={pathSlug}
            display={display}
            puck={puck}
            fallback={<PostItems items={items} pathSlug={pathSlug} display={display} />}
          />
        )}
      />
    </DataBlockFrame>
  );
}

export function AgendaArchiveBlock({ id, item, title, display, box, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const query = usePublicAgendas(apiSlug, { limit: 50, sortBy: 'startsAt', sortOrder: 'asc' });
  const items = query.data?.items || [];
  return (
    <DataBlockFrame box={box} puck={puck}>
      {title ? <h2 className="mb-6 font-headline text-2xl text-neutral-900">{title}</h2> : null}
      <DataBlockState
        puck={puck}
        ready={ready}
        query={query}
        emptyLabel="Arsip agenda — belum ada agenda terbit di unit ini"
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
          fallback={<AgendaList items={items} display={display} />}
        />
      </DataBlockState>
    </DataBlockFrame>
  );
}

export function CategoryFeedBlock({ id, item, title, category, limit, featuredOnly, display, box, puck }) {
  const { apiSlug, pathSlug, ready } = useBuilderSlugs();
  const query = usePublicPosts(apiSlug, {
    limit: Number(limit) || 6,
    category: category || undefined,
    featured: featuredOnly === true || featuredOnly === 'true' ? true : undefined,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const items = query.data?.items || [];
  const archiveHref = category ? `${ROUTES.unitPosts(pathSlug)}?category=${category}` : ROUTES.unitPosts(pathSlug);

  return (
    <DataBlockFrame box={box} puck={puck}>
      <DataBlockState
        puck={puck}
        ready={ready}
        query={query}
        emptyLabel="Arsip kategori — belum ada konten terbit untuk filter ini"
        emptyPreview={
          <section>
            <h2 className="mb-4 font-headline text-2xl text-neutral-900">{title || 'Konten'}</h2>
            <DataLoop
              id={id}
              slot={item}
              items={SAMPLE_POSTS}
              source="post"
              pathSlug={pathSlug}
              display={display}
              puck={puck}
              fallback={<PostItems items={SAMPLE_POSTS} pathSlug={pathSlug} display={display} />}
            />
          </section>
        }
      >
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-headline text-2xl text-neutral-900">{title || 'Konten'}</h2>
            <Link to={archiveHref} className="text-sm text-primary">
              Lihat semua
            </Link>
          </div>
          <DataLoop
            id={id}
            slot={item}
            items={items}
            source="post"
            pathSlug={pathSlug}
            display={display}
            puck={puck}
            fallback={<PostItems items={items} pathSlug={pathSlug} display={display} />}
          />
        </section>
      </DataBlockState>
    </DataBlockFrame>
  );
}
