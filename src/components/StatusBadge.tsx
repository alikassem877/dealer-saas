const COLORS: Record<string, { bg: string; text: string }> = {
  AVAILABLE: { bg: "var(--color-success-bg)", text: "var(--color-success)" },
  RESERVED: { bg: "var(--color-warning-bg)", text: "var(--color-warning)" },
  SOLD: { bg: "var(--color-neutral-bg)", text: "var(--color-text-muted)" },
  LEAD: { bg: "var(--color-lead-bg)", text: "var(--color-lead)" },
  CUSTOMER: { bg: "var(--color-success-bg)", text: "var(--color-success)" },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = COLORS[status] ?? { bg: "var(--color-neutral-bg)", text: "var(--color-text)" };

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: "0.2rem 0.6rem",
        borderRadius: 6,
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}