import { EditorToolbarButton } from './EditorToolbarButton';

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-base-300" />;
}

function headingValue(editor) {
  if (editor.isActive('heading', { level: 2 })) return 'h2';
  if (editor.isActive('heading', { level: 3 })) return 'h3';
  return 'p';
}

/**
 * Toolbar artikel: format dasar, sisip, dan aksi tabel saat sel aktif.
 */
export function EditorToolbar({ editor, onRequestImage }) {
  if (!editor) return null;

  function promptLink() {
    const previous = editor.getAttributes('link').href;
    const href = window.prompt('URL tautan', previous || 'https://');
    if (href === null) return;
    if (!href) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href }).run();
  }

  function insertImage() {
    if (onRequestImage) {
      onRequestImage();
      return;
    }
    const src = window.prompt('URL gambar', 'https://');
    if (src) editor.chain().focus().setImage({ src }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-base-300 bg-base-200 px-1 py-1">
      <EditorToolbarButton icon="mdi:undo" label="Undo" onClick={() => editor.chain().focus().undo().run()} />
      <EditorToolbarButton icon="mdi:redo" label="Redo" onClick={() => editor.chain().focus().redo().run()} />
      <Divider />
      <select
        className="select select-xs w-28"
        value={headingValue(editor)}
        onChange={(event) => {
          const value = event.target.value;
          const chain = editor.chain().focus();
          if (value === 'p') chain.setParagraph().run();
          else chain.toggleHeading({ level: Number(value.replace('h', '')) }).run();
        }}
      >
        <option value="p">Paragraf</option>
        <option value="h2">Judul</option>
        <option value="h3">Subjudul</option>
      </select>
      <EditorToolbarButton icon="mdi:format-bold" label="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <EditorToolbarButton icon="mdi:format-italic" label="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <EditorToolbarButton icon="mdi:format-underline" label="Garis bawah" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <EditorToolbarButton icon="mdi:link-variant" label="Tautan" active={editor.isActive('link')} onClick={promptLink} />
      <Divider />
      <EditorToolbarButton icon="mdi:format-align-left" label="Rata kiri" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <EditorToolbarButton icon="mdi:format-align-center" label="Tengah" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <EditorToolbarButton icon="mdi:format-align-right" label="Kanan" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
      <Divider />
      <EditorToolbarButton icon="mdi:format-list-bulleted" label="Daftar" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <EditorToolbarButton icon="mdi:format-list-numbered" label="Bernomor" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <EditorToolbarButton icon="mdi:format-quote-close" label="Kutipan" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <EditorToolbarButton icon="mdi:image-outline" label="Gambar" onClick={insertImage} />
      <EditorToolbarButton icon="mdi:table" label="Tabel" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
      {editor.isActive('table') ? (
        <>
          <EditorToolbarButton icon="mdi:table-row-plus-after" label="Tambah baris" onClick={() => editor.chain().focus().addRowAfter().run()} />
          <EditorToolbarButton icon="mdi:table-column-plus-after" label="Tambah kolom" onClick={() => editor.chain().focus().addColumnAfter().run()} />
          <EditorToolbarButton icon="mdi:table-remove" label="Hapus tabel" onClick={() => editor.chain().focus().deleteTable().run()} />
        </>
      ) : null}
      <Divider />
      <EditorToolbarButton icon="mdi:format-clear" label="Hapus format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
    </div>
  );
}
