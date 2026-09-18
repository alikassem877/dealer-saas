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
        Make
        <input value={values.make} onChange={updateField("make")} required style={inputStyle} />
      </label>
      <label>
        Model
        <input value={values.model} onChange={updateField("model")} required style={inputStyle} />
      </label>
      <label>
        Year
        <input
          type="number"
          value={values.year}
          onChange={updateField("year")}
          required
          style={inputStyle}
        />
      </label>
      <label>
        VIN
        <input
          value={values.vin}
          onChange={updateField("vin")}
          required
          maxLength={17}
          style={inputStyle}
        />
      </label>
      <label>
        Price ($)
        <input
          type="number"
          step="0.01"
          value={values.price}
          onChange={updateField("price")}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Mileage
        <input
          type="number"
          value={values.mileage}
          onChange={updateField("mileage")}
          style={inputStyle}
        />
      </label>
      <label>
        Color
        <input value={values.color} onChange={updateField("color")} style={inputStyle} />
      </label>

      <div style={{ gridColumn: "1 / -1" }}>
        {submitError && <p style={{ color: "crimson" }}>{submitError}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginRight: "0.5rem" }}>
          {isSubmitting ? "Saving..." : initialVehicle ? "Save changes" : "Add vehicle"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.4rem",
  display: "block",
  marginTop: "0.2rem",
};