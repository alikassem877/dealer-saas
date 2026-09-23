const STATUS_CLASSES: Record<string, string> = {
  AVAILABLE: "status-badge status-available",
  RESERVED: "status-badge status-reserved",
  SOLD: "status-badge status-sold",
  LEAD: "status-badge status-lead",
  CUSTOMER: "status-badge status-customer",

  TRIAL: "status-badge status-trial",
  ACTIVE: "status-badge status-active",
  EXPIRED: "status-badge status-expired",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={STATUS_CLASSES[status] ?? "status-badge status-default"}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}