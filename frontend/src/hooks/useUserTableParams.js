import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export function useUserTableParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = searchParams.get('search') || '';
  const search = useDebounce(searchInput, 400);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const role = searchParams.get('role') || '';

  const params = useMemo(() => {
    const query = { page, limit, sortBy, sortOrder };
    if (search) query.search = search;
    if (role) query.role = role;
    return query;
  }, [page, limit, sortBy, sortOrder, search, role]);

  function update(next) {
    const merged = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') merged.delete(key);
      else merged.set(key, String(value));
    });
    if ('search' in next || 'role' in next || 'limit' in next) merged.set('page', '1');
    setSearchParams(merged);
  }

  return {
    searchInput,
    page,
    limit,
    sortBy,
    sortOrder,
    role,
    params,
    setSearch: (search) => update({ search }),
    setPage: (page) => update({ page }),
    setLimit: (limit) => update({ limit }),
    setSort: (sortBy, sortOrder) => update({ sortBy, sortOrder }),
    setRole: (role) => update({ role }),
  };
}
