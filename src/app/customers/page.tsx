"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { useApiData } from "@/lib/api/useApiData";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import { CustomerForm, type CustomerFormValues } from "@/components/CustomerForm";
import type { Customer } from "@/lib/api/types";
import Link from "next/link";

export default function CustomersPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <CustomersContent />
    </RequireAuth>
  );
}

function CustomersContent() {
  const { data, isLoading, error, refetch } = useApiData<{ customers: Customer[] }>(
    "/api/customers"
  );

  const [mode, setMode] = useState
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
      await apiFetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(toPayload(values)),
      });
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
      // This is where the backend's "can't delete with sales history" message surfaces
      setRowError(err instanceof ApiClientError ? err.message : "Failed to delete customer.");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Customers</h1>
        <Link href="/dashboard">← Dashboard</Link>
      </div>

      {mode.type === "closed" && (
        <button onClick={() => setMode({ type: "create" })} style={{ margin: "1rem 0" }}>
          + Add Customer
        </button>
      )}

      {mode.type === "create" && (
        <CustomerForm
          onSubmit={handleCreate}
          onCancel={() => setMode({ type: "closed" })}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {mode.type === "edit" && (
        <CustomerForm
          initialCustomer={mode.customer}
          onSubmit={(values) => handleUpdate(mode.customer.id, values)}
          onCancel={() => setMode({ type: "closed" })}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {isLoading && <p>Loading customers...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {rowError && <p style={{ color: "crimson" }}>{rowError}</p>}

      {data && data.customers.length === 0 && <p>No customers yet. Add your first one above.</p>}

      {data && data.customers.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Phone</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {data.customers.map((customer) => (
              <tr key={customer.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={cellStyle}>{customer.name}</td>
                <td style={cellStyle}>{customer.email ?? "—"}</td>
                <td style={cellStyle}>{customer.phone ?? "—"}</td>
                <td style={cellStyle}>
                  <StatusBadge status={customer.status} />
                </td>
                <td style={cellStyle}>
                  <button
                    onClick={() => setMode({ type: "edit", customer })}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(customer)}>Delete</button>
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