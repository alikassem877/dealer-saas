import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signToken, verifyToken } from "@/lib/auth/jwt";

describe("password hashing", () => {
  it("produces a bcrypt hash, not the plain password", async () => {
    const hash = await hashPassword("mypassword123");
    expect(hash).not.toBe("mypassword123");
    expect(hash.startsWith("$2b$")).toBe(true);
  });

  it("verifies a correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    expect(await verifyPassword("correct-horse-battery-staple", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("salts each hash differently, even for the same password", async () => {
    const hashA = await hashPassword("samepassword");
    const hashB = await hashPassword("samepassword");
    expect(hashA).not.toBe(hashB);
  });
});

describe("JWT sign/verify", () => {
  const payload = {
    userId: "user_123",
    role: "DEALERSHIP_OWNER" as const,
    dealershipId: "dealer_abc",
  };

  it("round-trips a valid payload", () => {
    const decoded = verifyToken(signToken(payload));
    expect(decoded).toMatchObject(payload);
  });

  it("rejects a tampered token", () => {
    const token = signToken(payload);
    const tampered = token.slice(0, -2) + "xx";
    expect(verifyToken(tampered)).toBeNull();
  });

  it("rejects garbage input instead of throwing", () => {
    expect(verifyToken("not.a.real.token")).toBeNull();
  });
});