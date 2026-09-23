"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { PlatformShell } from "@/components/PlatformShell";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import type { PlatformDealership } from "@/lib/api/types";

export default function PlatformDashboardPage() {
  return (
    <RequireAuth allowedRoles={["PLATFORM_OWNER"]}>
      <PlatformShell>
        <PlatformDashboardContent />
      </PlatformShell>
    </RequireAuth>
  );
}

function PlatformDashboardContent() {
  const { data, isLoading, error, refetch } = useApiData<{ dealerships: PlatformDealership[] }>(
    "/api/platform/dealerships"
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  async function updateStatus(id: string, subscriptionStatus: string) {
    setUpdatingId(id);
    setRowError(null);
    try {
      await apiFetch(`/api/platform/dealerships/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ subscriptionStatus }),
      });
      await refetch();
    } catch (err) {
      setRowError(err instanceof ApiClientError ? err.message : "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl">Dealerships</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Every dealership registered on the platform.
      </p>

      {isLoading && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading…
        </p>
      )}
      {error && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-danger)" }}>
          {error}
        </p>
      )}
      {rowError && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-danger)" }}>
          {rowError}
        </p>
      )}

      {data && data.dealerships.length === 0 && (
        <div className="empty-state mt-6">No dealerships have registered yet.</div>
      )}

      {data && data.dealerships.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dealership</th>
                <th>Email</th>
                <th>Vehicles</th>
                <th>Customers</th>
                <th>Sales</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {data.dealerships.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{d.email}</td>
                  <td>{d._count.vehicles}</td>
                  <td>{d._count.customers}</td>
                  <td>{d._count.sales}</td>
                  <td>
                    <StatusBadge status={d.subscriptionStatus} />
                  </td>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <select
                      className="field-input"
                      value={d.subscriptionStatus}
                      disabled={updatingId === d.id}
                      onChange={(e) => updateStatus(d.id, e.target.value)}
                      style={{ minWidth: 110 }}
                    >
                      <option value="TRIAL">Trial</option>
                      <option value="ACTIVE">Active</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}