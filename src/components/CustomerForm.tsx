"use client";

import { useState, FormEvent } from "react";
import type { Customer, CustomerStatus } from "@/lib/api/types";

export type CustomerFormValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: CustomerStatus;
};

function toFormValues(customer?: Customer): CustomerFormValues {
  if (!customer) {
    return { name: "", email: "", phone: "", notes: "", status: "LEAD" };
  }
  return {
    name: customer.name,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    notes: customer.notes ?? "",
    status: customer.status,
  };
}

export function CustomerForm({
  initialCustomer,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: {
  initialCustomer?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const [values, setValues] = useState<CustomerFormValues>(toFormValues(initialCustomer));

  function updateField<K extends keyof CustomerFormValues>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value as CustomerFormValues[K] }));
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
        Name
        <input value={values.name} onChange={updateField("name")} required style={inputStyle} />
      </label>
      <label>
        Status
        <select value={values.status} onChange={updateField("status")} style={inputStyle}>
          <option value="LEAD">Lead</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </label>
      <label>
        Email
        <input type="email" value={values.email} onChange={updateField("email")} style={inputStyle} />
      </label>
      <label>
        Phone
        <input value={values.phone} onChange={updateField("phone")} style={inputStyle} />
      </label>
      <label style={{ gridColumn: "1 / -1" }}>
        Notes
        <textarea
          value={values.notes}
          onChange={updateField("notes")}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>

      <div style={{ gridColumn: "1 / -1" }}>
        {submitError && <p style={{ color: "crimson" }}>{submitError}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginRight: "0.5rem" }}>
          {isSubmitting ? "Saving..." : initialCustomer ? "Save changes" : "Add customer"}
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