export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card">
      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </div>
      <div className="font-display mt-1 text-2xl">{value}</div>
      {hint && (
        <div className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}