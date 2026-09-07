import { SortableList } from '../common/SortableList';
import { Icon } from '../ui/Icon';

function typeLabel(type) {
  return (
    {
      external_url: 'URL',
      page: 'Halaman',
      post_category: 'Kategori',
      archive: 'Arsip',
      dynamic_content: 'Data dinamis',
    }[type] || type
  );
}

function MenuRow({ item, editingId, onEdit, onDelete }) {
  return (
    <div className={`flex items-center justify-between gap-2 ${editingId === item.id ? 'rounded-md bg-primary/5 px-1' : ''}`}>
      <div className="min-w-0">
        <p className="truncate text-sm">{item.label}</p>
        <p className="text-xs text-base-content/50">{typeLabel(item.type)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" className="btn btn-ghost btn-square btn-xs" onClick={() => onEdit(item)} aria-label="Edit">
          <Icon icon="mdi:pencil-outline" className="size-4" />
        </button>
        <button type="button" className="btn btn-ghost btn-square btn-xs" onClick={() => onDelete(item)} aria-label="Hapus">
          <Icon icon="mdi:trash-can-outline" className="size-4" />
        </button>
      </div>
    </div>
  );
}

function NestedChildren({ nodes, editingId, onEdit, onDelete, depth = 1 }) {
  if (!nodes?.length) return null;
  return (
    <div className={`mt-2 space-y-2 ${depth === 1 ? 'ml-1 border-l-2 border-base-300 pl-3' : 'ml-2 border-l border-base-300 pl-3'}`}>
      {nodes.map((child) => (
        <div key={child.id} className="rounded-md border border-base-300 bg-base-200/50 px-3 py-2">
          <MenuRow item={child} editingId={editingId} onEdit={onEdit} onDelete={onDelete} />
          <NestedChildren nodes={child.children} editingId={editingId} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

function collectReorderPayload(roots) {
  const payload = [];
  function walk(nodes, parentId) {
    nodes.forEach((node, index) => {
      payload.push({ id: node.id, parentId, order: index });
      walk(node.children || [], node.id);
    });
  }
  walk(roots, null);
  return payload;
}

/**
 * Satu lokasi menu (navbar/footer): root bisa diurut, submenu menjorok di dalam card induk.
 */
export function MenuLocationSection({ title, hint, tree, editingId, onEdit, onDelete, onReorder, onAdd }) {
  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          {hint ? <p className="text-xs text-base-content/55">{hint}</p> : null}
        </div>
        <button type="button" className="btn btn-ghost btn-xs" onClick={onAdd}>
          <Icon icon="mdi:plus" className="size-4" />
          Tambah
        </button>
      </div>
      {!tree.length ? (
        <p className="rounded-md border border-dashed border-base-300 bg-base-100 px-4 py-8 text-center text-sm text-base-content/60">
          Belum ada item.
        </p>
      ) : (
        <SortableList
          items={tree}
          onReorder={(next) => onReorder(collectReorderPayload(next))}
          renderItem={(item) => (
            <div>
              <MenuRow item={item} editingId={editingId} onEdit={onEdit} onDelete={onDelete} />
              <NestedChildren nodes={item.children} editingId={editingId} onEdit={onEdit} onDelete={onDelete} />
            </div>
          )}
        />
      )}
    </section>
  );
}
