"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled frontend error:", error);
  }, [error]);

  return (
    <main className="auth-page flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <h1 className="text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Try again, or head back to the dashboard.
        </p>
        <button onClick={() => reset()} className="btn btn-primary mt-6">
          Try again
        </button>
      </div>
    </main>
  );
}