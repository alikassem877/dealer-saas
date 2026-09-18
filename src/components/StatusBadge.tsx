const COLORS: Record<string, { bg: string; text: string }> = {
  AVAILABLE: { bg: "#e6f4ea", text: "#1e7e34" },
  RESERVED: { bg: "#fff3cd", text: "#856404" },
  SOLD: { bg: "#f1f1f1", text: "#555" },
  LEAD: { bg: "#e7f1ff", text: "#0056b3" },
  CUSTOMER: { bg: "#e6f4ea", text: "#1e7e34" },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = COLORS[status] ?? { bg: "#eee", text: "#333" };

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: "0.2rem 0.6rem",
        borderRadius: 12,
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}