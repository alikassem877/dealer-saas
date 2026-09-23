"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth/AuthContext";
import { useApiData } from "@/lib/api/useApiData";
import { StatCard } from "@/components/StatCard";
import type { DashboardData } from "@/lib/api/types";

export default function DashboardPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data, isLoading, error } = useApiData<DashboardData>("/api/dashboard");

  return (
    <div>
      <h1 className="text-2xl">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Here&apos;s how {user?.dealership?.name} is doing.
      </p>

      {isLoading && (
        <p className="mt-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading dashboard…
        </p>
      )}
      {error && (
        <p className="feedback-error mt-8" role="alert">
          {error}
        </p>
      )}

      {data && (
        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Inventory
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Available" value={data.vehicles.available} />
              <StatCard label="Reserved" value={data.vehicles.reserved} />
              <StatCard label="Sold" value={data.vehicles.sold} />
              <StatCard label="Total vehicles" value={data.vehicles.total} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Customers
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Active leads" value={data.leads.active} />
              <StatCard label="Total customers" value={data.leads.totalCustomers} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              This month
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Sales" value={data.salesThisMonth.count} />
              <StatCard
                label="Revenue"
                value={`$${data.salesThisMonth.revenue.toLocaleString()}`}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}