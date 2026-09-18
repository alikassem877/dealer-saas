"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { SaleForm, type SaleFormValues } from "@/components/SaleForm";
import type { Sale, Vehicle, Customer } from "@/lib/api/types";
import Link from "next/link";

export default function SalesPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <SalesContent />
    </RequireAuth>
  );
}

function SalesContent() {
  const sales = useApiData<{ sales: Sale[] }>("/api/sales");
  const vehicles = useApiData<{ vehicles: Vehicle[] }>("/api/vehicles");
  const customers = useApiData<{ customers: Customer[] }>("/api/customers");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = sales.isLoading || vehicles.isLoading || customers.isLoading;
  const loadError = sales.error || vehicles.error || customers.error;

  const availableVehicles = (vehicles.data?.vehicles ?? []).filter(
    (v) => v.status === "AVAILABLE"
  );

  async function handleCreate(values: SaleFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch("/api/sales", {
        method: "POST",
        body: JSON.stringify({
          vehicleId: values.vehicleId,
          customerId: values.customerId,
          salePrice: Number(values.salePrice),
          notes: values.notes || undefined,
        }),
      });
      setIsFormOpen(false);
      // Refresh all three — a sale changes sales, vehicle status, and possibly customer status
      await Promise.all([sales.refetch(), vehicles.refetch(), customers.refetch()]);
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to record sale.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Sales</h1>
        <Link href="/dashboard">← Dashboard</Link>
      </div>

      {!isFormOpen && (
        <button onClick={() => setIsFormOpen(true)} style={{ margin: "1rem 0" }}>
          + Record Sale
        </button>
      )}

      {isFormOpen && (
        <SaleForm
          availableVehicles={availableVehicles}
          customers={customers.data?.customers ?? []}
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {isLoading && <p>Loading sales...</p>}
      {loadError && <p style={{ color: "crimson" }}>{loadError}</p>}

      {sales.data && sales.data.sales.length === 0 && (
        <p>No sales recorded yet.</p>
      )}

      {sales.data && sales.data.sales.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>Vehicle</th>
              <th style={cellStyle}>Customer</th>
              <th style={cellStyle}>Price</th>
              <th style={cellStyle}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sales.data.sales.map((sale) => (
              <tr key={sale.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={cellStyle}>{new Date(sale.saleDate).toLocaleDateString()}</td>
                <td style={cellStyle}>
                  {sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}
                </td>
                <td style={cellStyle}>{sale.customer.name}</td>
                <td style={cellStyle}>${Number(sale.salePrice).toLocaleString()}</td>
                <td style={cellStyle}>{sale.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const cellStyle: React.CSSProperties = { padding: "0.6rem 0.5rem" };