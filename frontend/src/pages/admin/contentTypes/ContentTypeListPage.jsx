import { Link } from 'react-router-dom';
import { DataTable } from '../../../components/common/DataTable';
import { PageHeader } from '../../../components/admin/PageHeader';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { useCmsTableParams } from '../../../hooks/useCmsTableParams';
import { ROUTES } from '../../../constants/routes';
import { Can } from '../../../policies/AbilityContext';
export default function ContentTypeListPage(){const table=useCmsTableParams();const query=useContentTypes(table.params);const columns=[{key:'name',header:'Nama',sortable:true},{key:'key',header:'Key',sortable:true},{key:'activeVersion',header:'Versi aktif',render:r=>r.activeVersion||'Belum terbit'},{key:'actions',header:'Aksi',render:r=><div className="flex gap-2"><Link className="btn btn-sm" to={ROUTES.adminContentEntries(r.id)}>Entri</Link><Link className="btn btn-ghost btn-sm" to={ROUTES.adminContentTypeEdit(r.id)}>Schema</Link></div>}];return <div><PageHeader title="Jenis data situs" subtitle="Buat data terstruktur yang dapat digunakan ulang di halaman." action={<Can I="create" a="ContentType"><Link className="btn btn-primary" to={ROUTES.adminContentTypeNew}>Tambah jenis data</Link></Can>}/><DataTable columns={columns} rows={query.data?.items||[]} total={query.data?.total||0} page={table.page} limit={table.limit} sortBy={table.sortBy} sortOrder={table.sortOrder} search={table.searchInput} isLoading={query.isLoading} onSearchChange={table.setSearch} onPageChange={table.setPage} onLimitChange={table.setLimit} onSortChange={table.setSort}/></div>}
