export function Feedback({ error, message }) {
  if (!error && !message) return null;
  return <div role={error ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error || message}</div>;
}

export function Button({ children, variant = 'primary', ...props }) {
  return <button className={variant === 'primary' ? 'button-primary' : 'button-secondary'} {...props}>{children}</button>;
}
