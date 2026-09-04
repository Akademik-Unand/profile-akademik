export function Spinner({ className = 'size-4' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-neutral-300 border-t-primary ${className}`}
    />
  );
}
