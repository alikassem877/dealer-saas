"use client";

import { useState, FormEvent } from "react";
import type { Vehicle } from "@/lib/api/types";

export type VehicleFormValues = {
  make: string;
  model: string;
  year: string;
  vin: string;
  price: string;
  mileage: string;
  color: string;
};

function toFormValues(vehicle?: Vehicle): VehicleFormValues {
  if (!vehicle) {
    return { make: "", model: "", year: "", vin: "", price: "", mileage: "0", color: "" };
  }
  return {
    make: vehicle.make,
    model: vehicle.model,
    year: String(vehicle.year),
    vin: vehicle.vin,
    price: vehicle.price,
    mileage: String(vehicle.mileage),
    color: vehicle.color ?? "",
  };
}

export function VehicleForm({
  initialVehicle,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: {
  initialVehicle?: Vehicle;
  onSubmit: (values: VehicleFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const [values, setValues] = useState<VehicleFormValues>(toFormValues(initialVehicle));

  function updateField(field: keyof VehicleFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

    return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Make</label>
          <input className="field-input" value={values.make} onChange={updateField("make")} required />
        </div>
        <div>
          <label className="field-label">Model</label>
          <input className="field-input" value={values.model} onChange={updateField("model")} required />
        </div>
        <div>
          <label className="field-label">Year</label>
          <input
            className="field-input"
            type="number"
            value={values.year}
            onChange={updateField("year")}
            required
          />
        </div>
        <div>
          <label className="field-label">VIN</label>
          <input
            className="field-input"
            value={values.vin}
            onChange={updateField("vin")}
            required
            maxLength={17}
          />
        </div>
        <div>
          <label className="field-label">Price ($)</label>
          <input
            className="field-input"
            type="number"
            step="0.01"
            value={values.price}
            onChange={updateField("price")}
            required
          />
        </div>
        <div>
          <label className="field-label">Mileage</label>
          <input
            className="field-input"
            type="number"
            value={values.mileage}
            onChange={updateField("mileage")}
          />
        </div>
        <div>
          <label className="field-label">Color</label>
          <input className="field-input" value={values.color} onChange={updateField("color")} />
        </div>
      </div>

      {submitError && (
        <p className="mt-3 text-sm" style={{ color: "var(--color-danger)" }}>
          {submitError}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? "Saving…" : initialVehicle ? "Save changes" : "Add vehicle"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}