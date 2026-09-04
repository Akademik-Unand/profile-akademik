export function Input({ label, error, id, className = '', ...props }) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm text-neutral-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`h-10 rounded-md border border-neutral-300 bg-surface px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-primary ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}
