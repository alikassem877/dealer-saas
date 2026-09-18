"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";

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
    <RedirectIfAuthenticated>
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="card w-full max-w-sm">
          <h1 className="text-2xl">Register your dealership</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Set up your account in a minute.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="field-label">Dealership name</label>
              <input
                className="field-input"
                value={form.dealershipName}
                onChange={updateField("dealershipName")}
                required
              />
            </div>
            <div>
              <label className="field-label">Dealership email</label>
              <input
                className="field-input"
                type="email"
                value={form.dealershipEmail}
                onChange={updateField("dealershipEmail")}
                required
              />
            </div>
            <div>
              <label className="field-label">Your name</label>
              <input
                className="field-input"
                value={form.ownerName}
                onChange={updateField("ownerName")}
                required
              />
            </div>
            <div>
              <label className="field-label">Your email</label>
              <input
                className="field-input"
                type="email"
                value={form.ownerEmail}
                onChange={updateField("ownerEmail")}
                required
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                value={form.password}
                onChange={updateField("password")}
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "var(--color-danger)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="mt-5 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-primary)" }}>
              Log in
            </Link>
          </p>
        </div>
      </main>
    </RedirectIfAuthenticated>
  );
}