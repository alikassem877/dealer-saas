import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb, testPrisma } from "../helpers/testDb";
import { TestClient } from "../helpers/testClient";

describe("auth flow", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("registers a dealership and starts a session", async () => {
    const client = new TestClient();
    const res = await client.post("/api/auth/register", {
      dealershipName: "Test Motors",
      dealershipEmail: "contact@testmotors.com",
      ownerName: "Owner Person",
      ownerEmail: "owner@testmotors.com",
      password: "password123",
    });

    expect(res.status).toBe(200);

    const me = await client.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.dealership.name).toBe("Test Motors");
  });

  it("rejects registration with a duplicate email", async () => {
    const client = new TestClient();
    await client.post("/api/auth/register", {
      dealershipName: "First Motors",
      dealershipEmail: "first@test.com",
      ownerName: "Alice",
      ownerEmail: "dupe@test.com",
      password: "password123",
    });

const second = await client.post("/api/auth/register", {
  dealershipName: "Second Motors",
  dealershipEmail: "second@test.com",
  ownerName: "Bob",
  ownerEmail: "dupe@test.com",
  password: "password123",
});

expect(second.status).toBe(409);

  });

  it("logs in correctly, rejects a wrong password", async () => {
    const setup = new TestClient();
    await setup.post("/api/auth/register", {
      dealershipName: "Login Test Motors",
      dealershipEmail: "login@test.com",
      ownerName: "Owner",
      ownerEmail: "loginowner@test.com",
      password: "password123",
    });

    const client = new TestClient();
    expect((await client.post("/api/auth/login", {
      email: "loginowner@test.com",
      password: "wrongpassword",
    })).status).toBe(401);

    expect((await client.post("/api/auth/login", {
      email: "loginowner@test.com",
      password: "password123",
    })).status).toBe(200);
  });

  it("rejects /api/auth/me when logged out", async () => {
    const res = await new TestClient().get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});