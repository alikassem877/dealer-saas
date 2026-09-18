"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";

export default function DashboardPage() {
  return (
    <RequireAuth allowedRoles={["DEALERSHIP_OWNER"]}>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.name}</h1>
      <p>Dealership: {user?.dealership?.name}</p>
      <button onClick={logout}>Log out</button>
    </main>
  );
}