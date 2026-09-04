import { useEffect } from 'react';

/**
 * Set document title and meta description/keywords for public pages.
 */
export function SeoHead({ title, description, keywords }) {
  useEffect(() => {
    const previous = document.title;
    if (title) document.title = title;

    function upsert(name, content) {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!content) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    upsert('description', description);
    upsert('keywords', keywords);

    return () => {
      document.title = previous;
    };
  }, [title, description, keywords]);

  return null;
}
