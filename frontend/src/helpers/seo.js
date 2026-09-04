export function resolvePageSeo({ unit, title, metaTitle, metaDescription, metaKeywords } = {}) {
  const unitName = unit?.name || 'Universitas Andalas';
  const resolvedTitle = metaTitle || (title ? `${title} | ${unitName}` : unit?.seoTitle || unitName);
  return {
    title: resolvedTitle,
    description: metaDescription || unit?.seoDescription || unit?.description || '',
    keywords: metaKeywords || unit?.seoKeywords || '',
  };
}
