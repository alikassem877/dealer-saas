import { describe, it, expect } from "vitest";
import { createCustomerSchema } from "@/lib/validation/customer";

describe("createCustomerSchema", () => {
  it("accepts a customer with only a name", () => {
    expect(createCustomerSchema.safeParse({ name: "Karim Haddad" }).success).toBe(true);
  });

  it("normalizes email to lowercase", () => {
    const result = createCustomerSchema.safeParse({
      name: "Rana Khoury",
      email: "Rana@Example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("rana@example.com");
  });

  it("rejects a malformed email", () => {
    expect(createCustomerSchema.safeParse({ name: "X", email: "not-an-email" }).success).toBe(false);
  });

  it("defaults status to LEAD", () => {
    const result = createCustomerSchema.safeParse({ name: "New Lead" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("LEAD");
  });
});