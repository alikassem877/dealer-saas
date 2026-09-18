import Link from "next/link";
import { RedirectIfAuthenticated } from "@/components/RedirectIfAuthenticated";

export default function HomePage() {
  return (
    <RedirectIfAuthenticated>
      <main
        style={{
          maxWidth: 600,
          margin: "6rem auto",
          padding: "0 1rem",
          textAlign: "center",
        }}
      >
        <h1>Dealer SaaS</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Inventory, leads, and sales management for automotive dealerships.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/login">
            <button style={{ padding: "0.6rem 1.2rem" }}>Log in</button>
          </Link>
          <Link href="/register">
            <button style={{ padding: "0.6rem 1.2rem" }}>Register your dealership</button>
          </Link>
        </div>
      </main>
    </RedirectIfAuthenticated>
  );
}