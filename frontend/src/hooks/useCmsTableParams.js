import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export function useCmsTableParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = searchParams.get('search') || '';
  const search = useDebounce(searchInput, 400);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const status = searchParams.get('status') || '';
  const unitId = searchParams.get('unitId') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const period = searchParams.get('period') || '';

  const params = useMemo(() => {
    const query = { page, limit, sortBy, sortOrder };
    if (search) query.search = search;
    if (status) query.status = status;
    if (unitId === 'main') query.site = 'main';
    else if (unitId) query.unitId = Number(unitId);
    if (categoryId) query.categoryId = Number(categoryId);
    if (period) query.period = period;
    return query;
  }, [page, limit, sortBy, sortOrder, search, status, unitId, categoryId, period]);

  function update(next) {
    const merged = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') merged.delete(key);
      else merged.set(key, String(value));
    });
    if ('search' in next || 'status' in next || 'unitId' in next || 'categoryId' in next || 'period' in next || 'limit' in next) {
      merged.set('page', '1');
    }
    setSearchParams(merged);
  }

  return {
    searchInput,
    page,
    limit,
    sortBy,
    sortOrder,
    status,
    unitId,
    categoryId,
    period,
    params,
    setSearch: (search) => update({ search }),
    setPage: (page) => update({ page }),
    setLimit: (limit) => update({ limit }),
    setSort: (sortBy, sortOrder) => update({ sortBy, sortOrder }),
    setStatus: (status) => update({ status }),
    setUnitId: (unitId) => update({ unitId }),
    setCategoryId: (categoryId) => update({ categoryId }),
    setPeriod: (period) => update({ period }),
  };
}
