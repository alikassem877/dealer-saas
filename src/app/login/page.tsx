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
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await refreshUser(); // fetch the now-logged-in user into context
      router.push("/dashboard");
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
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="card w-full max-w-sm">
          <h1 className="text-2xl">Log in</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Welcome back.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "var(--color-danger)" }}>
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
}