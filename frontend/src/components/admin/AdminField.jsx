export function AdminField({ label, error, children }) {
  return (
    <fieldset className="fieldset">
      {label ? <legend className="fieldset-legend">{label}</legend> : null}
      {children}
      {error ? <p className="label text-error">{error}</p> : null}
    </fieldset>
  );
}
