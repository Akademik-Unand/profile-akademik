import { Icon } from '../ui/Icon';

function SortIcon({ active, order }) {
  if (!active) {
    return <Icon icon="mdi:unfold-more-horizontal" className="size-4 opacity-40" />;
  }
  return <Icon icon={order === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="size-4" />;
}

function DataTableSkeleton({ columnCount }) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columnCount }).map((_, index) => (
              <th key={index}>
                <div className="skeleton h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: columnCount }).map((__, col) => (
                <td key={col}>
                  <div className="skeleton h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  total = 0,
  page = 1,
  limit = 10,
  sortBy,
  sortOrder = 'desc',
  search,
  isLoading = false,
  emptyMessage = 'Belum ada data',
  filters,
  onSearchChange,
  onPageChange,
  onLimitChange,
  onSortChange,
}) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  function handleSort(column) {
    if (!column.sortable || !onSortChange) return;
    const nextOrder = sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(column.key, nextOrder);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="skeleton h-10 w-64" />
          <div className="skeleton h-10 w-32" />
        </div>
        <DataTableSkeleton columnCount={columns.length} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <fieldset className="fieldset w-full max-w-xs p-0">
          <legend className="fieldset-legend">Cari</legend>
          <input
            className="input w-full"
            value={search}
            placeholder="Cari..."
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </fieldset>
        {filters}
        <fieldset className="fieldset w-28 p-0">
          <legend className="fieldset-legend">Per halaman</legend>
          <select className="select" value={limit} onChange={(event) => onLimitChange?.(Number(event.target.value))}>
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.sortable ? (
                    <button type="button" className="inline-flex items-center gap-1" onClick={() => handleSort(column)}>
                      {column.header}
                      <SortIcon active={sortBy === column.key} order={sortOrder} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center opacity-60">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="opacity-70">
          Menampilkan {from}–{to} dari {total}
        </p>
        <div className="join">
          <button
            type="button"
            className="join-item btn btn-sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            Sebelumnya
          </button>
          <button type="button" className="join-item btn btn-sm btn-disabled">
            {page} / {pageCount}
          </button>
          <button
            type="button"
            className="join-item btn btn-sm"
            disabled={page >= pageCount}
            onClick={() => onPageChange?.(page + 1)}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
