"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { VehicleForm, type VehicleFormValues } from "@/components/VehicleForm";
import type { Vehicle } from "@/lib/api/types";

export default function InventoryPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <AppShell>
        <InventoryContent />
      </AppShell>
    </RequireAuth>
  );
}

function InventoryContent() {
  const { data, isLoading, error, refetch } = useApiData<{ vehicles: Vehicle[] }>(
    "/api/vehicles"
  );

  const [mode, setMode] = useState<
  { type: "closed" } | { type: "create" } | { type: "edit"; vehicle: Vehicle }
>({ type: "closed" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  function toPayload(values: VehicleFormValues) {
    return {
      make: values.make,
      model: values.model,
      year: Number(values.year),
      vin: values.vin,
      price: Number(values.price),
      mileage: Number(values.mileage || 0),
      color: values.color || undefined,
    };
  }

  async function handleCreate(values: VehicleFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch("/api/vehicles", { method: "POST", body: JSON.stringify(toPayload(values)) });
      setMode({ type: "closed" });
      await refetch();
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to create vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(vehicleId: string, values: VehicleFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch(`/api/vehicles/${vehicleId}`, {
        method: "PATCH",
        body: JSON.stringify(toPayload(values)),
      });
      setMode({ type: "closed" });
      await refetch();
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to update vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    setRowError(null);
    if (!confirm(`Delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`)) return;
    try {
      await apiFetch(`/api/vehicles/${vehicle.id}`, { method: "DELETE" });
      await refetch();
    } catch (err) {
      setRowError(err instanceof ApiClientError ? err.message : "Failed to delete vehicle.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl">Inventory</h1>
          <p>Track vehicles, pricing, and availability in one place.</p>
        </div>
        {mode.type === "closed" && (
          <button className="btn btn-primary" onClick={() => setMode({ type: "create" })}>
            Add vehicle
          </button>
        )}
      </div>

      {mode.type === "create" && (
        <div className="card mt-6">
          <VehicleForm
            onSubmit={handleCreate}
            onCancel={() => setMode({ type: "closed" })}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      )}

      {mode.type === "edit" && (
        <div className="card mt-6">
          <VehicleForm
            initialVehicle={mode.vehicle}
            onSubmit={(values) => handleUpdate(mode.vehicle.id, values)}
            onCancel={() => setMode({ type: "closed" })}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      )}

      {isLoading && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading vehicles…
        </p>
      )}
      {error && (
        <p className="feedback-error mt-6" role="alert">
          {error}
        </p>
      )}
      {rowError && (
        <p className="feedback-error mt-6" role="alert">
          {rowError}
        </p>
      )}

      {data && data.vehicles.length === 0 && (
        <div className="empty-state mt-6">No vehicles yet. Add your first one above.</div>
      )}

      {data && data.vehicles.length > 0 && (
       <div className="mt-6 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>VIN</th>
              <th>Price</th>
              <th>Mileage</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </td>
                <td style={{ color: "var(--color-text-muted)" }}>{vehicle.vin}</td>
                <td>${Number(vehicle.price).toLocaleString()}</td>
                <td>{vehicle.mileage.toLocaleString()} mi</td>
                <td>
                  <StatusBadge status={vehicle.status} />
                </td>
                <td>
                  {vehicle.status !== "SOLD" && (
                    <div className="flex gap-3">
                      <button
                        className="link-danger"
                        style={{ color: "var(--color-primary)" }}
                        onClick={() => setMode({ type: "edit", vehicle })}
                      >
                        Edit
                      </button>
                      <button className="link-danger" onClick={() => handleDelete(vehicle)}>
                        Delete
                      </button>
                    </div>
                  )}
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