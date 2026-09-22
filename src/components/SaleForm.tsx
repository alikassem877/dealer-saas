"use client";

import { useState, FormEvent } from "react";
import type { Vehicle, Customer } from "@/lib/api/types";

export type SaleFormValues = {
  vehicleId: string;
  customerId: string;
  salePrice: string;
  notes: string;
};

export function SaleForm({
  availableVehicles,
  customers,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: {
  availableVehicles: Vehicle[];
  customers: Customer[];
  onSubmit: (values: SaleFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const [values, setValues] = useState<SaleFormValues>({
    vehicleId: "",
    customerId: "",
    salePrice: "",
    notes: "",
  });

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: 6,
    marginTop: "0.25rem",
  };

  function handleVehicleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const vehicleId = e.target.value;
    const vehicle = availableVehicles.find((v) => v.id === vehicleId);

    setValues((prev) => ({
      ...prev,
      vehicleId,
      // Convenience: pre-fill the sale price with the vehicle's listed price,
      // but the user can still negotiate it up or down before submitting
      salePrice: vehicle ? vehicle.price : prev.salePrice,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <label>
        Vehicle
        <select
          value={values.vehicleId}
          onChange={handleVehicleChange}
          required
          style={inputStyle}
        >
          <option value="" disabled>
            Select an available vehicle
          </option>

          {availableVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.year} {v.make} {v.model} — $
              {Number(v.price).toLocaleString()}
            </option>
          ))}
        </select>
      </label>

      <label>
        Customer
        <select
          value={values.customerId}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              customerId: e.target.value,
            }))
          }
          required
          style={inputStyle}
        >
          <option value="" disabled>
            Select a customer
          </option>

          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.email ? `(${c.email})` : ""}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sale price ($)
        <input
          type="number"
          step="0.01"
          value={values.salePrice}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              salePrice: e.target.value,
            }))
          }
          required
          style={inputStyle}
        />
      </label>

      <label>
        Notes
        <input
          value={values.notes}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          style={inputStyle}
        />
      </label>

      <div style={{ gridColumn: "1 / -1" }}>
        {submitError && (
          <p style={{ color: "crimson" }}>{submitError}</p>
        )}

        {availableVehicles.length === 0 && (
          <p style={{ color: "#856404" }}>
            No available vehicles to sell. Add inventory first.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || availableVehicles.length === 0}
          style={{ marginRight: "0.5rem" }}
        >
          {isSubmitting ? "Recording sale..." : "Record sale"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}