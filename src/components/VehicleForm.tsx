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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="vehicle-make">Make</label>
          <input id="vehicle-make" className="field-input" value={values.make} onChange={updateField("make")} required />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-model">Model</label>
          <input id="vehicle-model" className="field-input" value={values.model} onChange={updateField("model")} required />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-year">Year</label>
          <input
            id="vehicle-year"
            className="field-input"
            type="number"
            value={values.year}
            onChange={updateField("year")}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-vin">VIN</label>
          <input
            id="vehicle-vin"
            className="field-input"
            value={values.vin}
            onChange={updateField("vin")}
            required
            maxLength={17}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-price">Price ($)</label>
          <input
            id="vehicle-price"
            className="field-input"
            type="number"
            step="0.01"
            value={values.price}
            onChange={updateField("price")}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-mileage">Mileage</label>
          <input
            id="vehicle-mileage"
            className="field-input"
            type="number"
            value={values.mileage}
            onChange={updateField("mileage")}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="vehicle-color">Color</label>
          <input id="vehicle-color" className="field-input" value={values.color} onChange={updateField("color")} />
        </div>
      </div>

      {submitError && (
        <p className="feedback-error mt-4" role="alert">
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