"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiClientError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
  const result = await apiFetch<{ user: { role: string } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await refreshUser();

  router.push(
    result.user.role === "PLATFORM_OWNER"
      ? "/platform/dashboard"
      : "/dashboard"
  );

    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

    return (
    <RedirectIfAuthenticated>
      <main className="auth-page flex min-h-screen items-center justify-center px-4 py-10">
        <div className="auth-card card w-full max-w-sm">
          <p className="brand-kicker">Dealer SaaS</p>
          <h1 className="text-2xl">Log in</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Welcome back.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="field-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="feedback-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-sm" style={{ color: "var(--color-text-muted)" }}>
            No account?{" "}
            <Link href="/register" style={{ color: "var(--color-primary)" }}>
              Register your dealership
            </Link>
          </p>
        </div>
      </main>
    </RedirectIfAuthenticated>
  );
}