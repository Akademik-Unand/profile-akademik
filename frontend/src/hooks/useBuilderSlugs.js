import { useBuilderRuntime } from '../builder/BuilderRuntime';
import { resolveBuilderSlugs } from '../helpers/builderSlugs';

export function useBuilderSlugs() {
  const { unit, unitSlug } = useBuilderRuntime();
  return { ...resolveBuilderSlugs(unit, unitSlug), unit };
}
