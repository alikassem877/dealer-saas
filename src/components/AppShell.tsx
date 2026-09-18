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
    <div className="flex min-h-screen">
      <aside
        className="flex w-56 shrink-0 flex-col justify-between border-r px-4 py-6"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <div>
          <div className="mb-8 px-2">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Dealership
            </p>
            <h2 className="text-lg leading-tight">{user?.dealership?.name}</h2>
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

        <div className="px-2">
          <p className="mb-2 truncate text-sm" style={{ color: "var(--color-text-muted)" }}>
            {user?.name}
          </p>
          <button onClick={logout} className="btn btn-secondary w-full">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-10 py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}