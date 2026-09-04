const tones = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  neutral: 'bg-neutral-100 text-neutral-700',
};

export function Badge({ children, tone = 'neutral' }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}
