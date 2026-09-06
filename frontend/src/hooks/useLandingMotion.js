import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAos } from '../helpers/aosInit';
import { prefersReducedMotion } from '../helpers/motion';

gsap.registerPlugin(ScrollTrigger);

export function useLandingMotion(rootRef, revision) {
  const introPlayedRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    initAos();
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const hero = root.querySelector('[data-landing-hero]');
      const bg = root.querySelector('[data-landing-hero-bg]');
      const copy = root.querySelector('[data-landing-hero-copy]');
      const services = root.querySelector('[data-landing-services]');
      const gallery = root.querySelector('[data-landing-gallery]');

      if (!introPlayedRef.current) {
        introPlayedRef.current = true;

        if (copy?.children?.length) {
          gsap.from(copy.children, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power2.out',
          });
        }

        if (services) {
          gsap.from(services, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            delay: 0.15,
            ease: 'power2.out',
          });
        }
      }

      if (hero && bg) {
        gsap.fromTo(
          bg,
          { scale: 1.08, yPercent: 0 },
          {
            scale: 1.16,
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      if (gallery) {
        const images = gallery.querySelectorAll('img');
        if (images.length) {
          gsap.fromTo(
            images,
            { scale: 1.08 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: gallery,
                start: 'top 85%',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
      }
    }, root);

    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, [rootRef, revision]);
}
