import { publicHref } from './publicHref';

export function resolveHeroSlides(landing, posts = [], unitSlug) {
  const landingSlides = (landing?.slides || [])
    .filter((slide) => slide.media?.url)
    .map((slide) => ({
      id: `slide-${slide.id}`,
      image: slide.media.url,
      title: slide.title || landing.heroTitle,
      excerpt: slide.caption || landing.heroSubtitle,
      href: slide.linkUrl || landing.ctaUrl || null,
    }));
  if (landingSlides.length) return landingSlides;
  return posts
    .filter((post) => post.cover?.url || post.title)
    .map((post) => ({
      id: `post-${post.id}`,
      image: post.cover?.url,
      title: post.title,
      excerpt: post.excerpt,
      href: publicHref(unitSlug, 'post', post.slug),
    }));
}
