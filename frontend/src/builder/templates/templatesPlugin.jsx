import { useMemo, useState } from 'react';
import { createUsePuck } from '@puckeditor/core';
import { Icon } from '../../components/ui/Icon';
import { BUILDER_TEMPLATES, cloneBuilderNodes } from './builderTemplates';

const usePuck = createUsePuck();

function TemplatesPanel() {
  const dispatch = usePuck((s) => s.dispatch);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BUILDER_TEMPLATES;
    return BUILDER_TEMPLATES.filter((item) =>
      [item.title, item.description, item.category].join(' ').toLowerCase().includes(q),
    );
  }, [query]);

  function insertTemplate(template) {
    const nodes = cloneBuilderNodes(template.nodes);
    if (!nodes.length) return;
    dispatch({
      type: 'setData',
      recordHistory: true,
      data: (previous) => ({
        content: [...(previous.content || []), ...nodes],
      }),
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div>
        <p className="text-sm font-medium">Template</p>
        <p className="text-[11px] leading-4 text-base-content/55">Susunan siap pakai. Klik untuk menambah di bawah halaman.</p>
      </div>
      <input
        className="input input-sm w-full"
        placeholder="Cari template…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Cari template"
      />
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.map((template) => (
          <button
            key={template.id}
            type="button"
            className="flex w-full items-start gap-2 rounded-md border border-base-300 bg-base-100 px-2.5 py-2 text-left hover:border-primary"
            onClick={() => insertTemplate(template)}
          >
            <Icon icon={template.icon} className="mt-0.5 size-4 shrink-0 text-base-content/70" />
            <span className="min-w-0">
              <span className="block text-sm leading-5">{template.title}</span>
              <span className="block text-[11px] leading-4 text-base-content/55">{template.description}</span>
              <span className="mt-1 inline-block text-[10px] uppercase tracking-wide text-base-content/45">{template.category}</span>
            </span>
          </button>
        ))}
        {!filtered.length ? <p className="text-sm text-base-content/60">Tidak ada template yang cocok.</p> : null}
      </div>
    </div>
  );
}

/**
 * Plugin sidebar Puck: Template (di antara Blok dan Susunan lewat urutan plugins).
 */
export function templatesPlugin() {
  return {
    name: 'templates',
    label: 'Template',
    icon: <Icon icon="mdi:view-dashboard-outline" className="size-4" />,
    render: () => <TemplatesPanel />,
  };
}
