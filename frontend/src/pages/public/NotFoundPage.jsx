import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-base px-4">
      <h1 className="text-2xl text-neutral-900">Halaman tidak ditemukan</h1>
      <Link to={ROUTES.home} className="mt-4 text-sm text-primary">
        Kembali ke beranda
      </Link>
    </div>
  );
}
