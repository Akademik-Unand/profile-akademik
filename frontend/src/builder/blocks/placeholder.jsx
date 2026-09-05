/**
 * Penanda di kanvas saat blok sudah dijatuhkan tapi isinya masih kosong.
 */
export function BlockPlaceholder({ label }) {
  return (
    <div className="builder-placeholder mx-4 my-3 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-600">
      {label}
    </div>
  );
}
