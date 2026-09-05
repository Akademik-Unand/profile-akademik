import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { useEffect } from 'react';
import { imageClass } from '../../helpers/contentImage';
import { ContentImage } from './editor/ContentImage';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageToolbar } from './editor/ImageToolbar';

/**
 * Editor artikel ringkas: judul, format dasar, tautan, gambar, dan tabel.
 */
export function RichTextEditor({ value = '', onChange, onRequestImage }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
      ContentImage,
      TableKit.configure({ table: { resizable: true } }),
      Typography,
      Placeholder.configure({ placeholder: 'Tulis konten di sini...' }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-80 px-6 py-5 outline-none',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange?.(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return <div className="skeleton h-80 w-full" />;

  function requestImage() {
    if (!onRequestImage) {
      const src = window.prompt('URL gambar', 'https://');
      if (src) editor.chain().focus().setImage({ src, class: imageClass() }).run();
      return;
    }
    onRequestImage((attrs) => {
      editor.chain().focus().setImage({
        src: attrs.src,
        alt: attrs.alt || '',
        class: imageClass(),
      }).run();
    });
  }

  return (
    <div className="overflow-hidden rounded-md border border-base-300 bg-base-100">
      <EditorToolbar editor={editor} onRequestImage={requestImage} />
      {editor.isActive('image') ? <ImageToolbar editor={editor} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
}
