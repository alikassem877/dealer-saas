"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { CustomerForm, type CustomerFormValues } from "@/components/CustomerForm";
import type { Customer } from "@/lib/api/types";

export default function CustomersPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <AppShell>
        <CustomersContent />
      </AppShell>
    </RequireAuth>
  );
}

function CustomersContent() {
  const { data, isLoading, error, refetch } = useApiData<{ customers: Customer[] }>(
    "/api/customers"
  );

  const [mode, setMode] = useState<
  { type: "closed" } | { type: "create" } | { type: "edit"; customer: Customer }
>({ type: "closed" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  function toPayload(values: CustomerFormValues) {
    return {
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      notes: values.notes || undefined,
      status: values.status,
    };
  }

  async function handleCreate(values: CustomerFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch("/api/customers", { method: "POST", body: JSON.stringify(toPayload(values)) });
      setMode({ type: "closed" });
      await refetch();
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to create customer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(customerId: string, values: CustomerFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        body: JSON.stringify(toPayload(values)),
      });
      setMode({ type: "closed" });
      await refetch();
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Failed to update customer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(customer: Customer) {
    setRowError(null);
    if (!confirm(`Delete ${customer.name}?`)) return;
    try {
      await apiFetch(`/api/customers/${customer.id}`, { method: "DELETE" });
      await refetch();
    } catch (err) {
      setRowError(err instanceof ApiClientError ? err.message : "Failed to delete customer.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl">Customers</h1>
          <p>Manage your customer relationships and active leads.</p>
        </div>
        {mode.type === "closed" && (
          <button className="btn btn-primary" onClick={() => setMode({ type: "create" })}>
            Add customer
          </button>
        )}
      </div>

      {mode.type === "create" && (
        <div className="card mt-6">
          <CustomerForm
            onSubmit={handleCreate}
            onCancel={() => setMode({ type: "closed" })}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      )}

      {mode.type === "edit" && (
        <div className="card mt-6">
          <CustomerForm
            initialCustomer={mode.customer}
            onSubmit={(values) => handleUpdate(mode.customer.id, values)}
            onCancel={() => setMode({ type: "closed" })}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </div>
      )}

      {isLoading && (
        <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading customers…
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

      {data && data.customers.length === 0 && (
        <div className="empty-state mt-6">No customers yet. Add your first one above.</div>
      )}

      {data && data.customers.length > 0 && (
        <div className="table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td style={{ color: "var(--color-text-muted)" }}>{customer.email ?? "—"}</td>
                <td style={{ color: "var(--color-text-muted)" }}>{customer.phone ?? "—"}</td>
                <td>
                  <StatusBadge status={customer.status} />
                </td>
                <td>
                  <div className="flex gap-3">
                    <button
                      className="link-danger"
                      style={{ color: "var(--color-primary)" }}
                      onClick={() => setMode({ type: "edit", customer })}
                    >
                      Edit
                    </button>
                    <button className="link-danger" onClick={() => handleDelete(customer)}>
                      Delete
                    </button>
                  </div>
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