"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { SaleForm, type SaleFormValues } from "@/components/SaleForm";
import type { Sale, Vehicle, Customer } from "@/lib/api/types";

export default function SalesPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <AppShell>
        <SalesContent />
      </AppShell>
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
      await Promise.all([sales.refetch(), vehicles.refetch(), customers.refetch()]);
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to record sale.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Sales</h1>
        {!isFormOpen && (
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            Record sale
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="card mt-6">
          <SaleForm
            availableVehicles={availableVehicles}
            customers={customers.data?.customers ?? []}
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      )}

      {isLoading && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading sales…
        </p>
      )}
      {loadError && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-danger)" }}>
          {loadError}
        </p>
      )}

      {sales.data && sales.data.sales.length === 0 && (
        <div className="empty-state mt-6">No sales recorded yet.</div>
      )}

      {sales.data && sales.data.sales.length > 0 && (
        <table className="data-table mt-6">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sales.data.sales.map((sale) => (
              <tr key={sale.id}>
                <td style={{ color: "var(--color-text-muted)" }}>
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td>
                  {sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}
                </td>
                <td>{sale.customer.name}</td>
                <td>${Number(sale.salePrice).toLocaleString()}</td>
                <td style={{ color: "var(--color-text-muted)" }}>{sale.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}