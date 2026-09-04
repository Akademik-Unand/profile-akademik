import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../../components/admin/PageHeader';
import { AdminField } from '../../../components/admin/AdminField';
import { UnitSelect } from '../../../components/admin/UnitSelect';
import { MediaLibraryModal } from '../../../components/common/MediaLibraryModal';
import { LandingSlidesField } from '../../../components/admin/landing/LandingSlidesField';
import { LandingServicesField } from '../../../components/admin/landing/LandingServicesField';
import { LandingGalleryField } from '../../../components/admin/landing/LandingGalleryField';
import { landingFormSchema } from '../../../validations/cms.schema';
import { payloadUnitId } from '../../../helpers/cmsDisplay';
import { useLandingCurrent, useUpsertLanding } from '../../../hooks/useCms';
import { useAuthStore } from '../../../store/auth.store';

function toSlides(items = []) {
  return items.map((slide, index) => ({
    id: slide.id || `slide-${index}`,
    mediaId: slide.mediaId || null,
    title: slide.title || '',
    caption: slide.caption || '',
    linkUrl: slide.linkUrl || '',
    previewUrl: slide.media?.url || '',
  }));
}

function toServices(items = []) {
  return items.map((item, index) => ({
    id: item.id || `service-${index}`,
    label: item.label || '',
    icon: item.icon || 'mdi:link-variant',
    url: item.url || '',
  }));
}

function toGallery(items = []) {
  return items.map((item, index) => ({
    id: item.id || `gallery-${index}`,
    mediaId: item.mediaId || null,
    caption: item.caption || '',
    featured: Boolean(item.featured),
    previewUrl: item.media?.url || '',
  }));
}

export default function LandingEditorPage() {
  const user = useAuthStore((s) => s.user);
  const isSuper = user?.role === 'superadmin';
  const [unitId, setUnitId] = useState(isSuper ? '' : user?.units?.[0]?.id || '');
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null);

  const queryParams = useMemo(() => (isSuper && !unitId ? { site: 'main' } : { unitId }), [isSuper, unitId]);
  const query = useLandingCurrent(queryParams);
  const save = useUpsertLanding();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(landingFormSchema),
    defaultValues: {
      unitId: '',
      eyebrow: '',
      heroTitle: '',
      heroSubtitle: '',
      ctaLabel: '',
      ctaUrl: '',
      introTitle: '',
      introBody: '',
      newsTitle: '',
      announcementsTitle: '',
      agendaTitle: '',
      servicesTitle: '',
      galleryTitle: '',
      gallerySubtitle: '',
      unitsTitle: '',
      contactTitle: '',
      contactBody: '',
      showNews: true,
      showAgenda: true,
      showServices: true,
      showUnits: true,
      showGallery: true,
    },
  });

  useEffect(() => {
    if (!query.data) return;
    reset({
      unitId: query.data.unitId || '',
      eyebrow: query.data.eyebrow || '',
      heroTitle: query.data.heroTitle || '',
      heroSubtitle: query.data.heroSubtitle || '',
      ctaLabel: query.data.ctaLabel || '',
      ctaUrl: query.data.ctaUrl || '',
      introTitle: query.data.introTitle || '',
      introBody: query.data.introBody || '',
      newsTitle: query.data.newsTitle || '',
      announcementsTitle: query.data.announcementsTitle || '',
      agendaTitle: query.data.agendaTitle || '',
      servicesTitle: query.data.servicesTitle || '',
      galleryTitle: query.data.galleryTitle || '',
      gallerySubtitle: query.data.gallerySubtitle || '',
      unitsTitle: query.data.unitsTitle || '',
      contactTitle: query.data.contactTitle || '',
      contactBody: query.data.contactBody || '',
      showNews: query.data.showNews !== false,
      showAgenda: query.data.showAgenda !== false,
      showServices: query.data.showServices !== false,
      showUnits: Boolean(query.data.showUnits),
      showGallery: query.data.showGallery !== false,
    });
    setSlides(toSlides(query.data.slides));
    setServices(toServices(query.data.services));
    setGallery(toGallery(query.data.gallery));
  }, [query.data, reset]);

  function openMedia(type, id) {
    setMediaTarget({ type, id });
    setMediaOpen(true);
  }

  async function onSubmit(values) {
    await save.mutateAsync({
      unitId: payloadUnitId(unitId),
      site: isSuper && !unitId ? 'main' : undefined,
      eyebrow: values.eyebrow || null,
      heroTitle: values.heroTitle || null,
      heroSubtitle: values.heroSubtitle || null,
      ctaLabel: values.ctaLabel || null,
      ctaUrl: values.ctaUrl || null,
      introTitle: values.introTitle || null,
      introBody: values.introBody || null,
      newsTitle: values.newsTitle || null,
      announcementsTitle: values.announcementsTitle || null,
      agendaTitle: values.agendaTitle || null,
      servicesTitle: values.servicesTitle || null,
      galleryTitle: values.galleryTitle || null,
      gallerySubtitle: values.gallerySubtitle || null,
      unitsTitle: values.unitsTitle || null,
      contactTitle: values.contactTitle || null,
      contactBody: values.contactBody || null,
      showNews: values.showNews,
      showAgenda: values.showAgenda,
      showServices: values.showServices,
      showUnits: values.showUnits,
      showGallery: values.showGallery,
      slides: slides.map((slide, index) => ({
        mediaId: slide.mediaId || null,
        title: slide.title || null,
        caption: slide.caption || null,
        linkUrl: slide.linkUrl || null,
        order: index,
      })),
      services: services.map((item, index) => ({
        label: item.label || null,
        icon: item.icon || null,
        url: item.url || null,
        order: index,
      })),
      gallery: gallery.map((item, index) => ({
        mediaId: item.mediaId || null,
        caption: item.caption || null,
        featured: Boolean(item.featured),
        order: index,
      })),
    });
  }

  return (
    <div className="w-full">
      <PageHeader
        title="Landing page"
        subtitle="Hero, layanan, galeri, dan section beranda untuk situs utama atau unit."
        breadcrumbs={[{ label: 'Landing page' }]}
      />
      <form className="card bg-base-100 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body gap-2">
          <AdminField label="Lingkup">
            <UnitSelect
              value={unitId}
              onChange={(value) => {
                setUnitId(value);
              }}
            />
          </AdminField>
          {query.isLoading ? <div className="skeleton h-48 w-full" /> : null}
          <AdminField label="Label kecil" error={errors.eyebrow?.message}>
            <input className="input w-full" {...register('eyebrow')} />
          </AdminField>
          <AdminField label="Judul hero" error={errors.heroTitle?.message}>
            <input className="input w-full" {...register('heroTitle')} />
          </AdminField>
          <AdminField label="Kalimat hero" error={errors.heroSubtitle?.message}>
            <textarea className="textarea w-full" rows={3} {...register('heroSubtitle')} />
          </AdminField>
          <div className="grid gap-2 md:grid-cols-2">
            <AdminField label="Teks tombol">
              <input className="input w-full" {...register('ctaLabel')} />
            </AdminField>
            <AdminField label="URL tombol">
              <input className="input w-full" placeholder="/pengumuman" {...register('ctaUrl')} />
            </AdminField>
          </div>
          <AdminField label="Judul pengantar">
            <input className="input w-full" {...register('introTitle')} />
          </AdminField>
          <AdminField label="Teks pengantar">
            <textarea className="textarea w-full" rows={5} {...register('introBody')} />
          </AdminField>
          <LandingSlidesField slides={slides} onChange={setSlides} onPickMedia={(id) => openMedia('slide', id)} />
          <AdminField label="Judul layanan">
            <input className="input w-full" placeholder="Layanan" {...register('servicesTitle')} />
          </AdminField>
          <LandingServicesField services={services} onChange={setServices} />
          <div className="grid gap-2 md:grid-cols-2">
            <AdminField label="Judul galeri">
              <input className="input w-full" placeholder="Galeri" {...register('galleryTitle')} />
            </AdminField>
            <AdminField label="Subjudul galeri">
              <input className="input w-full" {...register('gallerySubtitle')} />
            </AdminField>
          </div>
          <LandingGalleryField items={gallery} onChange={setGallery} onPickMedia={(id) => openMedia('gallery', id)} />
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('showNews')} />
            Tampilkan berita
          </label>
          <AdminField label="Judul berita">
            <input className="input w-full" placeholder="Berita utama" {...register('newsTitle')} />
          </AdminField>
          <AdminField label="Judul pengumuman">
            <input className="input w-full" placeholder="Pengumuman" {...register('announcementsTitle')} />
          </AdminField>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('showAgenda')} />
            Tampilkan agenda
          </label>
          <AdminField label="Judul agenda">
            <input className="input w-full" placeholder="Agenda" {...register('agendaTitle')} />
          </AdminField>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('showServices')} />
            Tampilkan layanan
          </label>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('showGallery')} />
            Tampilkan galeri
          </label>
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('showUnits')} />
            Tampilkan daftar unit
          </label>
          <AdminField label="Judul daftar unit">
            <input className="input w-full" placeholder="Unit" {...register('unitsTitle')} />
          </AdminField>
          <AdminField label="Judul penutup">
            <input className="input w-full" placeholder="Akses layanan akademik" {...register('contactTitle')} />
          </AdminField>
          <AdminField label="Teks penutup">
            <textarea
              className="textarea w-full"
              rows={2}
              placeholder="Ajakan ke pengumuman atau agenda. Kontak unit tetap di footer."
              {...register('contactBody')}
            />
          </AdminField>
          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary" disabled={save.isPending}>
              Simpan
            </button>
          </div>
        </div>
      </form>
      <MediaLibraryModal
        open={mediaOpen}
        unitId={unitId}
        onClose={() => setMediaOpen(false)}
        onSelect={(media) => {
          if (mediaTarget?.type === 'gallery') {
            setGallery((current) =>
              current.map((item) =>
                item.id === mediaTarget.id ? { ...item, mediaId: media.id, previewUrl: media.url } : item,
              ),
            );
          } else {
            setSlides((current) =>
              current.map((slide) =>
                slide.id === mediaTarget?.id ? { ...slide, mediaId: media.id, previewUrl: media.url } : slide,
              ),
            );
          }
        }}
      />
    </div>
  );
}
