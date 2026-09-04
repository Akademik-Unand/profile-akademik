import { HeroCarousel } from './HeroCarousel';
import { FeaturedNews } from './FeaturedNews';
import { Announcements } from './Announcements';
import { AgendaSection } from './AgendaSection';
import { ServiceTiles } from './ServiceTiles';
import { GallerySection } from './GallerySection';
import { UnitDirectory } from './UnitDirectory';
import { IntroSection } from './IntroSection';
import { ClosingCta } from './ClosingCta';
import { LandingMotion } from './LandingMotion';
import { unitPathSlug } from '../../helpers/publicHref';
import { usePublicAgendas, usePublicPosts } from '../../hooks/useCms';
import { usePublicUnits } from '../../hooks/useUnits';

export function UnitHomeSections({ unit }) {
  const pathSlug = unitPathSlug(unit);
  const landing = unit.landing;
  const showServices = landing?.showServices !== false;
  const featured = usePublicPosts(unit.slug, { limit: 5, featured: true, sortBy: 'publishedAt', sortOrder: 'desc' });
  const latest = usePublicPosts(unit.slug, { limit: 6, sortBy: 'publishedAt', sortOrder: 'desc' });
  const announcements = usePublicPosts(unit.slug, {
    limit: 6,
    category: 'pengumuman',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const agendas = usePublicAgendas(unit.slug, { limit: 4, sortBy: 'startsAt', sortOrder: 'asc' });
  const unitsQuery = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' }, { enabled: Boolean(landing?.showUnits) });
  const heroPosts = featured.data?.items?.length ? featured.data.items : latest.data?.items || [];
  const announcementPosts = announcements.data?.items?.length ? announcements.data.items : latest.data?.items || [];
  const motionRevision = [
    latest.data?.items?.length || 0,
    announcementPosts.length,
    agendas.data?.items?.length || 0,
    unitsQuery.data?.items?.length || 0,
    landing?.gallery?.length || 0,
  ].join('-');

  return (
    <LandingMotion key={unit.id} revision={motionRevision}>
      <div className={showServices ? 'pb-4' : ''}>
        <HeroCarousel landing={landing} posts={heroPosts} unitSlug={pathSlug} overlap={showServices} />
        {showServices ? <ServiceTiles landing={landing} unitSlug={pathSlug} /> : null}
      </div>
      <IntroSection landing={landing} unitSlug={pathSlug} />
      {landing?.showNews !== false ? (
        <FeaturedNews posts={latest.data?.items || []} unitSlug={pathSlug} title={landing?.newsTitle} />
      ) : null}
      {landing?.showNews !== false || landing?.showAgenda !== false ? (
        <section className="bg-mist py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-2">
            {landing?.showNews !== false ? (
              <div data-aos="fade-right">
                <Announcements posts={announcementPosts} unitSlug={pathSlug} title={landing?.announcementsTitle} />
              </div>
            ) : null}
            {landing?.showAgenda !== false ? (
              <div data-aos="fade-left">
                <AgendaSection items={agendas.data?.items || []} unitSlug={pathSlug} title={landing?.agendaTitle} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      {landing?.showGallery !== false ? <GallerySection landing={landing} /> : null}
      {landing?.showUnits ? <UnitDirectory units={unitsQuery.data?.items || []} title={landing?.unitsTitle} /> : null}
      <ClosingCta landing={landing} unit={unit} unitSlug={pathSlug} />
    </LandingMotion>
  );
}
