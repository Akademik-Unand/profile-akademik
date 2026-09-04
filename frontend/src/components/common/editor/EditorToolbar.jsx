import { EditorToolbarButton } from './EditorToolbarButton';

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-base-300" />;
}

function headingValue(editor) {
  for (let level = 1; level <= 6; level += 1) {
    if (editor.isActive('heading', { level })) return `h${level}`;
  }
  return 'p';
}

/**
 * Toolbar editor bergaya pengolah kata.
 */
export function EditorToolbar({ editor, onInsertImage }) {
  if (!editor) return null;

  function promptLink() {
    const previous = editor.getAttributes('link').href;
    const href = window.prompt('URL tautan', previous || 'https://');
    if (href === null) return;
    if (!href) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href }).run();
  }

  function promptImageUrl() {
    if (onInsertImage) {
      onInsertImage();
      return;
    }
    const src = window.prompt('URL gambar', 'https://');
    if (src) editor.chain().focus().setImage({ src }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-base-300 bg-base-200 p-1">
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
        <option value="h1">Judul 1</option>
        <option value="h2">Judul 2</option>
        <option value="h3">Judul 3</option>
        <option value="h4">Judul 4</option>
        <option value="h5">Judul 5</option>
        <option value="h6">Judul 6</option>
      </select>
      <select
        className="select select-xs w-32"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) editor.chain().focus().setFontFamily(event.target.value).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
      >
        <option value="">Font</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Times New Roman, serif">Times New Roman</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Courier New, monospace">Courier New</option>
      </select>
      <select
        className="select select-xs w-20"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) editor.chain().focus().setFontSize(event.target.value).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
      >
        <option value="">Ukuran</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="32px">32</option>
      </select>
      <select
        className="select select-xs w-24"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) editor.chain().focus().setLineHeight(event.target.value).run();
          else editor.chain().focus().unsetLineHeight().run();
        }}
      >
        <option value="">Spasi</option>
        <option value="1">1.0</option>
        <option value="1.15">1.15</option>
        <option value="1.5">1.5</option>
        <option value="2">2.0</option>
      </select>
      <Divider />
      <EditorToolbarButton icon="mdi:format-bold" label="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <EditorToolbarButton icon="mdi:format-italic" label="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <EditorToolbarButton icon="mdi:format-underline" label="Garis bawah" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <EditorToolbarButton icon="mdi:format-strikethrough" label="Coret" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
      <EditorToolbarButton icon="mdi:code-tags" label="Kode" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
      <EditorToolbarButton icon="mdi:format-superscript" label="Superscript" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()} />
      <EditorToolbarButton icon="mdi:format-subscript" label="Subscript" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()} />
      <label className="btn btn-ghost btn-xs btn-square" title="Warna teks">
        <input type="color" className="h-4 w-4 cursor-pointer" onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
      </label>
      <label className="btn btn-ghost btn-xs btn-square" title="Warna latar">
        <input type="color" className="h-4 w-4 cursor-pointer" onChange={(event) => editor.chain().focus().setBackgroundColor(event.target.value).run()} />
      </label>
      <EditorToolbarButton icon="mdi:marker" label="Sorot" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} />
      <Divider />
      <EditorToolbarButton icon="mdi:format-align-left" label="Rata kiri" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <EditorToolbarButton icon="mdi:format-align-center" label="Tengah" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <EditorToolbarButton icon="mdi:format-align-right" label="Kanan" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
      <EditorToolbarButton icon="mdi:format-align-justify" label="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} />
      <Divider />
      <EditorToolbarButton icon="mdi:format-list-bulleted" label="List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <EditorToolbarButton icon="mdi:format-list-numbered" label="Numbered" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <EditorToolbarButton icon="mdi:checkbox-marked-outline" label="Checklist" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} />
      <EditorToolbarButton icon="mdi:format-indent-increase" label="Indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} />
      <EditorToolbarButton icon="mdi:format-indent-decrease" label="Outdent" onClick={() => editor.chain().focus().liftListItem('listItem').run()} />
      <Divider />
      <EditorToolbarButton icon="mdi:format-quote-close" label="Kutipan" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <EditorToolbarButton icon="mdi:code-braces" label="Blok kode" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
      <EditorToolbarButton icon="mdi:minus" label="Garis" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      <EditorToolbarButton icon="mdi:keyboard-return" label="Baris baru" onClick={() => editor.chain().focus().setHardBreak().run()} />
      <EditorToolbarButton icon="mdi:link-variant" label="Tautan" active={editor.isActive('link')} onClick={promptLink} />
      <EditorToolbarButton icon="mdi:image-outline" label="Gambar" onClick={promptImageUrl} />
      <Divider />
      <EditorToolbarButton icon="mdi:table" label="Sisip tabel" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
      <EditorToolbarButton icon="mdi:table-column-plus-after" label="Kolom kanan" onClick={() => editor.chain().focus().addColumnAfter().run()} />
      <EditorToolbarButton icon="mdi:table-column-plus-before" label="Kolom kiri" onClick={() => editor.chain().focus().addColumnBefore().run()} />
      <EditorToolbarButton icon="mdi:table-column-remove" label="Hapus kolom" onClick={() => editor.chain().focus().deleteColumn().run()} />
      <EditorToolbarButton icon="mdi:table-row-plus-after" label="Baris bawah" onClick={() => editor.chain().focus().addRowAfter().run()} />
      <EditorToolbarButton icon="mdi:table-row-plus-before" label="Baris atas" onClick={() => editor.chain().focus().addRowBefore().run()} />
      <EditorToolbarButton icon="mdi:table-row-remove" label="Hapus baris" onClick={() => editor.chain().focus().deleteRow().run()} />
      <EditorToolbarButton icon="mdi:table-merge-cells" label="Gabung sel" onClick={() => editor.chain().focus().mergeCells().run()} />
      <EditorToolbarButton icon="mdi:table-split-cell" label="Pisah sel" onClick={() => editor.chain().focus().splitCell().run()} />
      <EditorToolbarButton icon="mdi:table-row" label="Baris header" onClick={() => editor.chain().focus().toggleHeaderRow().run()} />
      <EditorToolbarButton icon="mdi:table-remove" label="Hapus tabel" onClick={() => editor.chain().focus().deleteTable().run()} />
      <Divider />
      <EditorToolbarButton icon="mdi:select-all" label="Pilih semua" onClick={() => editor.chain().focus().selectAll().run()} />
      <EditorToolbarButton icon="mdi:format-clear" label="Hapus format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
    </div>
  );
}
