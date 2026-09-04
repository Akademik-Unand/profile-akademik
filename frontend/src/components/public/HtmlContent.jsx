import { sanitizeHtml } from '../../utils/sanitizeHtml';

export function HtmlContent({ html }) {
  return <div className="public-content text-neutral-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
