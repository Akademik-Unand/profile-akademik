import { Link } from 'react-router-dom';
import { HtmlContent } from '../../components/public/HtmlContent';
import { GallerySection } from '../../components/public/GallerySection';
import { Icon } from '../../components/ui/Icon';
import { PUCK_IMAGE_ALIGN, PUCK_IMAGE_SIZE } from '../../helpers/contentImage';
import { showEditorChrome } from '../../helpers/builderChrome';
import { buttonBoxStyle } from '../../helpers/buttonStyle';
import { motionAttrs } from '../../helpers/blockMotion';
import { boxToMobileClass, editorBoxStyle, hasMeasure } from '../../helpers/layoutStyle';
import { useBoundField } from '../DataItemContext';
import { ALIGN_FLEX_CLASS } from '../tokens';
import { BlockPlaceholder } from './placeholder';

export function RichTextBlock({ html, bind, box, motion, puck }) {
  const bound = useBoundField(bind);
  return (
    <div className={`px-4 py-6 md:px-6 ${boxToMobileClass(box)}`} style={editorBoxStyle(box, puck)} {...motionAttrs(motion)}>
      {bound?.text ? <p className="text-neutral-700">{bound.text}</p> : <HtmlContent html={html} />}
    </div>
  );
}

export function ImageBlock({ image, caption, alt, size, align, bind, box, motion, puck }) {
  const bound = useBoundField(bind);
  const src = bound?.src || image?.url;
  if (!src) return <BlockPlaceholder label={bind ? 'Gambar data — item ini belum punya gambar' : 'Gambar — pilih file di panel kanan'} />;
  const width = hasMeasure(box?.width) ? '' : PUCK_IMAGE_SIZE[size] || PUCK_IMAGE_SIZE.md;
  const place = PUCK_IMAGE_ALIGN[align] || PUCK_IMAGE_ALIGN.center;
  return (
    <figure className={`px-4 py-4 md:px-6 ${width} ${place} ${boxToMobileClass(box)}`} style={editorBoxStyle(box, puck)} {...motionAttrs(motion)}>
      <img src={src} alt={alt || caption || bound?.text || ''} className="w-full rounded-md object-cover" />
      {caption ? <figcaption className="mt-2 text-sm text-neutral-600">{caption}</figcaption> : null}
    </figure>
  );
}

export function GalleryBlock({ title, subtitle, items = [], motion, puck }) {
  const gallery = items
    .map((item, index) => ({
      id: item.mediaId || item.image?.id || item.media?.id || index,
      mediaId: item.mediaId || item.image?.id || item.media?.id || null,
      caption: item.caption || '',
      featured: Boolean(item.featured),
      media: {
        url: item.url || item.image?.url || item.media?.url || '',
        altText: item.caption || item.image?.altText || item.media?.altText || '',
      },
    }))
    .filter((item) => item.media.url);

  if (!gallery.length) {
    return showEditorChrome(puck) ? <BlockPlaceholder label="Galeri — tambah foto di panel kanan" /> : null;
  }

  return (
    <div {...motionAttrs(motion)}>
      <GallerySection landing={{ galleryTitle: title, gallerySubtitle: subtitle, gallery }} />
    </div>
  );
}

export function ButtonBlock({ label, url, align, variant, bind, box, motion, puck }) {
  const bound = useBoundField(bind);
  const dest = bound?.href || url;
  const text = bound?.text && (bind === 'title' || bind === 'link') ? bound.text : label;
  if (!text || !dest) {
    return showEditorChrome(puck) ? <BlockPlaceholder label="Tombol — isi teks dan URL, atau tautkan ke data" /> : null;
  }
  const wrap = ALIGN_FLEX_CLASS[align] || ALIGN_FLEX_CLASS.left;
  const external = /^https?:\/\//i.test(dest || '');
  const style = buttonBoxStyle(variant, box);
  const className = 'text-sm';
  return (
    <div className={`flex w-full px-4 py-3 ${wrap}`} {...motionAttrs(motion)}>
      {external ? (
        <a href={dest} className={className} style={style} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        <Link to={dest} className={className} style={style}>
          {text}
        </Link>
      )}
    </div>
  );
}

export function QuoteBlock({ quote, cite, bind, motion }) {
  const bound = useBoundField(bind);
  const text = bound?.text || quote;
  if (!text) return <BlockPlaceholder label="Kutipan — isi teks di panel kanan, atau tautkan ke data" />;
  return (
    <blockquote className="mx-auto max-w-3xl px-4 py-10 text-center md:px-6" {...motionAttrs(motion)}>
      <p className="font-headline text-2xl text-neutral-900 md:text-3xl">{text}</p>
      {cite ? <footer className="mt-4 text-sm text-neutral-600">{cite}</footer> : null}
    </blockquote>
  );
}

export function AccordionBlock({ items = [], motion, puck }) {
  const rows = items.filter((item) => item.title);
  if (!rows.length) {
    return showEditorChrome(puck) ? <BlockPlaceholder label="Akordeon — tambah butir di panel kanan" /> : null;
  }
  return (
    <div className="mx-auto max-w-3xl space-y-2 px-4 py-6 md:px-6" {...motionAttrs(motion)}>
      {rows.map((item, index) => (
        <details key={`${item.title}-${index}`} className="rounded-md border border-neutral-200 bg-surface px-4 py-3">
          <summary className="cursor-pointer text-sm text-neutral-900">{item.title}</summary>
          {item.body ? <p className="mt-2 text-sm leading-7 text-neutral-600">{item.body}</p> : null}
        </details>
      ))}
    </div>
  );
}

export function EmbedBlock({ url, motion }) {
  const match = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (!match) return <BlockPlaceholder label="Video — tempel URL YouTube di panel kanan" />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6" {...motionAttrs(motion)}>
      <div className="aspect-video overflow-hidden rounded-md bg-hero">
        <iframe
          title="Video"
          src={`https://www.youtube-nocookie.com/embed/${match[1]}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function StatsBlock({ items = [], motion, puck }) {
  const rows = items.filter((item) => item.value);
  if (!rows.length) {
    return showEditorChrome(puck) ? <BlockPlaceholder label="Angka — isi statistik di panel kanan" /> : null;
  }
  return (
    <section className="bg-hero py-14 text-white" {...motionAttrs(motion)}>
      <ul className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {rows.map((item) => (
          <li key={`${item.value}-${item.label}`}>
            <p className="font-headline text-4xl">{item.value}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
              {item.icon ? <Icon icon={item.icon} className="size-4" /> : null}
              {item.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
