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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="field-label" htmlFor="sale-vehicle">Vehicle</label>
        <select
          id="sale-vehicle"
          className="field-input"
          value={values.vehicleId}
          onChange={handleVehicleChange}
          required
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
      </div>

      <div>
        <label className="field-label" htmlFor="sale-customer">Customer</label>
        <select
          id="sale-customer"
          className="field-input"
          value={values.customerId}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              customerId: e.target.value,
            }))
          }
          required
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
      </div>

      <div>
        <label className="field-label" htmlFor="sale-price">Sale price ($)</label>
        <input
          id="sale-price"
          className="field-input"
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
        />
      </div>

      <div>
        <label className="field-label" htmlFor="sale-notes">Notes</label>
        <input
          id="sale-notes"
          className="field-input"
          value={values.notes}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
        />
      </div>
      </div>

      <div className="mt-5">
        {submitError && (
          <p className="feedback-error mb-3" role="alert">{submitError}</p>
        )}

        {availableVehicles.length === 0 && (
          <p className="feedback-warning mb-3">
            No available vehicles to sell. Add inventory first.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || availableVehicles.length === 0}
          className="btn btn-primary mr-2"
        >
          {isSubmitting ? "Recording sale..." : "Record sale"}
        </button>

        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}