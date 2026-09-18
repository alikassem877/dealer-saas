"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { VehicleForm, type VehicleFormValues } from "@/components/VehicleForm";
import type { Vehicle } from "@/lib/api/types";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <InventoryContent />
    </RequireAuth>
  );
}

function InventoryContent() {
  const { data, isLoading, error, refetch } = useApiData<{ vehicles: Vehicle[] }>(
    "/api/vehicles"
  );

  const [mode, setMode] = useState<{ type: "closed" } | { type: "create" } | { type: "edit"; vehicle: Vehicle }>({
    type: "closed",
  });
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
      await apiFetch("/api/vehicles", {
        method: "POST",
        body: JSON.stringify(toPayload(values)),
      });
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
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Inventory</h1>
        <Link href="/dashboard">← Dashboard</Link>
      </div>

      {mode.type === "closed" && (
        <button onClick={() => setMode({ type: "create" })} style={{ margin: "1rem 0" }}>
          + Add Vehicle
        </button>
      )}

      {mode.type === "create" && (
        <VehicleForm
          onSubmit={handleCreate}
          onCancel={() => setMode({ type: "closed" })}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {mode.type === "edit" && (
        <VehicleForm
          initialVehicle={mode.vehicle}
          onSubmit={(values) => handleUpdate(mode.vehicle.id, values)}
          onCancel={() => setMode({ type: "closed" })}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {isLoading && <p>Loading vehicles...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {rowError && <p style={{ color: "crimson" }}>{rowError}</p>}

      {data && data.vehicles.length === 0 && <p>No vehicles yet. Add your first one above.</p>}

      {data && data.vehicles.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
              <th style={cellStyle}>Vehicle</th>
              <th style={cellStyle}>VIN</th>
              <th style={cellStyle}>Price</th>
              <th style={cellStyle}>Mileage</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {data.vehicles.map((vehicle) => (
              <tr key={vehicle.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={cellStyle}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </td>
                <td style={cellStyle}>{vehicle.vin}</td>
                <td style={cellStyle}>${Number(vehicle.price).toLocaleString()}</td>
                <td style={cellStyle}>{vehicle.mileage.toLocaleString()} mi</td>
                <td style={cellStyle}>
                  <StatusBadge status={vehicle.status} />
                </td>
                <td style={cellStyle}>
                  {vehicle.status !== "SOLD" && (
                    <>
                      <button
                        onClick={() => setMode({ type: "edit", vehicle })}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(vehicle)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const cellStyle: React.CSSProperties = { padding: "0.6rem 0.5rem" };