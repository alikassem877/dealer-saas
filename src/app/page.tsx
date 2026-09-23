import Link from "next/link";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";

export default function HomePage() {
  return (
    <RedirectIfAuthenticated>
      <main className="auth-page flex min-h-screen items-center justify-center px-4 py-10">
        <div className="max-w-md text-center">
          <p className="brand-kicker">Dealership operations, simplified</p>
          <h1 className="text-3xl">Dealer SaaS</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Inventory, leads, and sales in one place for your dealership.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login" className="btn btn-secondary">
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register your dealership
            </Link>
          </div>
        </div>
      </main>
    </RedirectIfAuthenticated>
  );
}