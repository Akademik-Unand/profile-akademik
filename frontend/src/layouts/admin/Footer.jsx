export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-2 border-t border-base-300 bg-base-100 px-6 py-4 text-xs text-base-content/60 sm:flex-row">
      <div>
        &copy; {new Date().getFullYear()} <span className="font-medium text-base-content/80">Universitas Andalas</span> — Web
        Profil Bidang Akademik.
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <span>Bantuan</span>
        <span>v0.1.0</span>
      </div>
    </footer>
  );
}
