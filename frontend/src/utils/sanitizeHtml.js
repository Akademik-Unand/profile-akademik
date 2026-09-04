import DOMPurify from 'dompurify';

export function sanitizeHtml(html = '') {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['colgroup', 'col', 'thead', 'tbody', 'tfoot'],
    ADD_ATTR: ['style', 'class', 'colspan', 'rowspan', 'data-type', 'data-checked', 'target', 'rel'],
  });
}
