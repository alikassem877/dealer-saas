"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { useApiData } from "@/lib/api/useApiData";
import { StatCard } from "@/components/StatCard";
import type { DashboardData } from "@/lib/api/types";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const { data, isLoading, error } = useApiData<DashboardData>("/api/dashboard");

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1>{user?.dealership?.name}</h1>
          <p style={{ color: "#666" }}>Welcome, {user?.name}</p>
        </div>
        <button onClick={logout}>Log out</button>
      </div>

      <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/inventory">Inventory</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/sales">Sales</Link>
      </nav>

      {isLoading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {data && (
        <>
          <h2 style={{ fontSize: "1rem", color: "#666" }}>Inventory</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Available" value={data.vehicles.available} />
            <StatCard label="Reserved" value={data.vehicles.reserved} />
            <StatCard label="Sold" value={data.vehicles.sold} />
            <StatCard label="Total vehicles" value={data.vehicles.total} />
          </div>

          <h2 style={{ fontSize: "1rem", color: "#666" }}>Customers</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Active leads" value={data.leads.active} />
            <StatCard label="Total customers" value={data.leads.totalCustomers} />
          </div>

          <h2 style={{ fontSize: "1rem", color: "#666" }}>This month</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <StatCard label="Sales" value={data.salesThisMonth.count} />
            <StatCard
              label="Revenue"
              value={`$${data.salesThisMonth.revenue.toLocaleString()}`}
            />
          </div>
        </>
      )}
    </main>
  );
}