import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BuilderWorkspace } from '../../../builder/BuilderWorkspace';
import { emptyBuilder, publishDocument, resolvePageDocument } from '../../../helpers/builderDocument';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { withPreviewQuery } from '../../../helpers/previewHref';
import { useAdminPage, useCreatePage, useUpdatePage } from '../../../hooks/useCms';
import { usePublicUnits } from '../../../hooks/useUnits';
import { ROUTES } from '../../../constants/routes';
import { slugify } from '../../../utils/slugify';
import { useAuthStore } from '../../../store/auth.store';

const PageBuilder = lazy(() => import('../../../builder/PageBuilder').then((mod) => ({ default: mod.PageBuilder })));

export default function PageBuilderPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const query = useAdminPage(id);
  const createItem = useCreatePage();
  const updateItem = useUpdatePage();
  const [title, setTitle] = useState('Halaman baru');
  const [slug, setSlug] = useState('halaman-baru');
  const [status, setStatus] = useState('draft');
  const [unitId, setUnitId] = useState(user?.role === 'superadmin' ? '' : user?.units?.[0]?.id || '');
  const [builder, setBuilder] = useState(null);
  const builderRef = useRef(builder);

  function rememberBuilder(next) {
    builderRef.current = next;
    setBuilder(next);
  }
  const canvasKey = isNew ? 'new' : id;

  useEffect(() => {
    if (isNew) {
      setBuilder((current) => {
        const next = current || emptyBuilder();
        builderRef.current = next;
        return next;
      });
      return;
    }
    if (!query.data) return;
    setTitle(query.data.title);
    setSlug(query.data.slug);
    setStatus(query.data.status);
    setUnitId(query.data.unitId ?? '');
    rememberBuilder(resolvePageDocument(query.data));
  }, [isNew, query.data?.id]);

  const previewHref = id ? withPreviewQuery(ROUTES.adminPagePreview(id)) : null;
  const unitsQuery = usePublicUnits({ limit: 50, sortBy: 'name', sortOrder: 'asc' });
  const units = unitsQuery.data?.items || [];
  const unit =
    query.data?.unit ||
    (unitId && units.find((item) => String(item.id) === String(unitId))) ||
    (!unitId ? units.find((item) => item.isDefault) : null) ||
    user?.units?.find((item) => String(item.id) === String(unitId)) ||
    null;
  const unitSlug = unit?.isDefault ? '' : unit?.slug || '';
  const saving = createItem.isPending || updateItem.isPending;

  async function persist(next, { publish = false } = {}) {
    const document = publishDocument(next, builderRef.current);
    if (document) builderRef.current = document;
    const nextStatus = publish ? 'published' : status;
    const payload = {
      title: title.trim() || 'Halaman baru',
      slug: slug.trim() || slugify(title) || 'halaman-baru',
      status: nextStatus,
      unitId: payloadUnitId(unitId),
      content: '',
      builder: document,
      layout: document?.root?.props || null,
    };
    if (isNew) {
      const result = await createItem.mutateAsync(payload);
      const created = result?.data?.page;
      if (created?.id) navigate(ROUTES.adminPageBuilder(created.id), { replace: true });
      return;
    }
    await updateItem.mutateAsync({ id, payload });
    if (publish) setStatus('published');
  }

  if ((!isNew && query.isLoading) || !builder || (!query.data?.unit?.slug && unitsQuery.isLoading)) {
    return (
      <div className="flex h-svh items-center justify-center bg-base-200">
        <div className="skeleton h-16 w-64" />
      </div>
    );
  }

  return (
    <BuilderWorkspace
      title={isNew ? 'Editor halaman baru' : title}
      subtitle="Blok dan pengaturan ada di panel kiri/kanan."
      backTo={ROUTES.adminPages}
      previewHref={previewHref}
      onSave={() => persist()}
      saving={saving}
      extraActions={
        <>
          <input
            className="input input-sm w-40"
            aria-label="Judul"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (isNew) setSlug(slugify(event.target.value));
            }}
          />
          <select className="select select-sm w-28" aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="draft">Draf</option>
            <option value="published">Terbit</option>
          </select>
        </>
      }
    >
      <Suspense fallback={<div className="skeleton h-full w-full" />}>
        <PageBuilder
          resetKey={canvasKey}
          data={builder}
          onChange={rememberBuilder}
          liveRef={builderRef}
          onPublish={(data) => persist(data, { publish: true })}
          unit={unit}
          unitSlug={unitSlug}
        />
      </Suspense>
    </BuilderWorkspace>
  );
}
