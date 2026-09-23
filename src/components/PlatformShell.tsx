"use client";

import { useAuth } from "@/lib/auth/AuthContext";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Platform Owner
          </p>
          <h2 className="text-lg leading-tight">{user?.name}</h2>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Log out
        </button>
      </header>
      <main className="px-4 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}