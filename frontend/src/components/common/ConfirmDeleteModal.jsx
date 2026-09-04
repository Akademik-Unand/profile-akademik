export function ConfirmDeleteModal({
  open,
  title = 'Hapus data',
  message = 'Data yang dihapus tidak dapat dikembalikan.',
  isSubmitting = false,
  onConfirm,
  onClose,
}) {
  return (
    <dialog className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="text-base font-medium">{title}</h3>
        <p className="mt-2 text-sm opacity-70">{message}</p>
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </button>
          <button type="button" className="btn btn-error" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : null}
            Hapus
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>
          tutup
        </button>
      </form>
    </dialog>
  );
}
