"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    dealershipName: "",
    dealershipEmail: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  function updateField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Register your dealership</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label>
          Dealership name
          <input
            value={form.dealershipName}
            onChange={updateField("dealershipName")}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Dealership email
          <input
            type="email"
            value={form.dealershipEmail}
            onChange={updateField("dealershipEmail")}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Your name
          <input
            value={form.ownerName}
            onChange={updateField("ownerName")}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Your email
          <input
            type="email"
            value={form.ownerEmail}
            onChange={updateField("ownerEmail")}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={updateField("password")}
            required
            minLength={8}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={isSubmitting} style={{ padding: "0.6rem" }}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}