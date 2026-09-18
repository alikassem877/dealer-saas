"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}