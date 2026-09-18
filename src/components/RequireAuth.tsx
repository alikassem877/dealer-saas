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
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // redirect is in-flight via the effect above
  }

  return <>{children}</>;
}