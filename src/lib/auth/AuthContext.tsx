"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type Role = "PLATFORM_OWNER" | "DEALERSHIP_OWNER";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  dealershipId: string | null;
  dealership: { id: string; name: string; subscriptionStatus: string } | null;
};

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function refreshUser() {
    try {
      const data = await apiFetch<{ user: CurrentUser }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  useEffect(() => {
  let cancelled = false;

  async function loadUser() {
    try {
      const data = await apiFetch<{ user: CurrentUser }>("/api/auth/me");

      if (!cancelled) {
        setUser(data.user);
        setIsLoading(false);
      }
    } catch {
      if (!cancelled) {
        setUser(null);
        setIsLoading(false);
      }
    }
  }

  loadUser();

  return () => {
    cancelled = true;
  };
}, []);
  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}