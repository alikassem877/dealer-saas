"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("PLATFORM_OWNER" | "DEALERSHIP_OWNER")[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait for the auth check to finish first

    if (!user) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/login");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading your workspace...</p>
      </main>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // redirect is in-flight via the effect above
  }

  return <>{children}</>;
}