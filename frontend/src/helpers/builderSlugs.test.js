import { resolveBuilderSlugs } from './builderSlugs';

describe('resolveBuilderSlugs', () => {
  it('uses the unit slug for the API and an empty path on the default site', () => {
    expect(resolveBuilderSlugs({ slug: 'akademik', isDefault: true }, '')).toEqual({
      apiSlug: 'akademik',
      pathSlug: '',
      ready: true,
    });
  });

  it('keeps a faculty slug for both API and path', () => {
    expect(resolveBuilderSlugs({ slug: 'fmipa', isDefault: false }, 'fmipa')).toEqual({
      apiSlug: 'fmipa',
      pathSlug: 'fmipa',
      ready: true,
    });
  });

  it('does not guess a unit while context is still empty', () => {
    expect(resolveBuilderSlugs(null, '')).toEqual({
      apiSlug: '',
      pathSlug: '',
      ready: false,
    });
  });

  it('falls back to the passed path slug when the unit object has no slug', () => {
    expect(resolveBuilderSlugs({ id: 3, isDefault: false }, 'ft')).toEqual({
      apiSlug: 'ft',
      pathSlug: 'ft',
      ready: true,
    });
  });
});
