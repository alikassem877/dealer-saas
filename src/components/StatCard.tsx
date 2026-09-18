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
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "1rem 1.25rem",
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: "0.85rem", color: "#666" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>{value}</div>
      {hint && <div style={{ fontSize: "0.75rem", color: "#999" }}>{hint}</div>}
    </div>
  );
}