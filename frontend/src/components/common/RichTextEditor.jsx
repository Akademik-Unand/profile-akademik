import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TableKit } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect } from 'react';
import { EditorToolbar } from './editor/EditorToolbar';

/**
 * Editor Tiptap lengkap (gaya pengolah kata) untuk halaman dan pengumuman.
 */
export function RichTextEditor({ value = '', onChange, onInsertImage }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      TextStyleKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TableKit.configure({ table: { resizable: true } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Placeholder.configure({ placeholder: 'Tulis konten di sini...' }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-64 px-3 py-2 outline-none',
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

  if (!editor) return <div className="skeleton h-64 w-full" />;

  return (
    <div className="overflow-hidden rounded-md border border-base-300 bg-base-100">
      <EditorToolbar editor={editor} onInsertImage={onInsertImage} />
      <EditorContent editor={editor} />
    </div>
  );
}
