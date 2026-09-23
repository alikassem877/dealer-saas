"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/customers", label: "Customers" },
  { href: "/sales", label: "Sales" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="app-shell flex min-h-screen">
      <aside
        className="app-sidebar flex w-56 shrink-0 flex-col justify-between border-r px-4 py-6"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div>
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
              DS
            </div>
            <div className="min-w-0">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Dealership
              </p>
              <h2 className="truncate text-base leading-tight">{user?.dealership?.name}</h2>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t px-2 pt-4" style={{ borderColor: "var(--color-border)" }}>
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="mb-3 truncate text-xs" style={{ color: "var(--color-text-muted)" }}>
            Dealership owner
          </p>
          <button onClick={logout} className="btn btn-secondary w-full">
            Log out
          </button>
        </div>
      </aside>

      <main className="app-main flex-1 px-10 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}