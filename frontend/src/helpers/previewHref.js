export function withPreviewQuery(href) {
  if (!href) return href;
  const [path, query = ''] = href.split('?');
  const params = new URLSearchParams(query);
  params.set('preview', '1');
  const next = params.toString();
  return next ? `${path}?${next}` : `${path}?preview=1`;
}

export function isPreviewRequest(searchParams) {
  return searchParams?.get('preview') === '1';
}
