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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Name</label>
          <input className="field-input" value={values.name} onChange={updateField("name")} required />
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="field-input" value={values.status} onChange={updateField("status")}>
            <option value="LEAD">Lead</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
        <div>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            type="email"
            value={values.email}
            onChange={updateField("email")}
          />
        </div>
        <div>
          <label className="field-label">Phone</label>
          <input className="field-input" value={values.phone} onChange={updateField("phone")} />
        </div>
        <div className="col-span-2">
          <label className="field-label">Notes</label>
          <textarea
            className="field-input"
            value={values.notes}
            onChange={updateField("notes")}
            rows={3}
          />
        </div>
      </div>

      {submitError && (
        <p className="mt-3 text-sm" style={{ color: "var(--color-danger)" }}>
          {submitError}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? "Saving…" : initialCustomer ? "Save changes" : "Add customer"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
