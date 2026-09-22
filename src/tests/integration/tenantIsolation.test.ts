import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb, testPrisma } from "../helpers/testDb";
import { TestClient } from "../helpers/testClient";

async function registerDealership(name: string, slug: string) {
  const client = new TestClient();
  await client.post("/api/auth/register", {
    dealershipName: name,
    dealershipEmail: `${slug}@test.com`,
    ownerName: `${slug} owner`,
    ownerEmail: `${slug}owner@test.com`,
    password: "password123",
  });
  return client;
}

describe("tenant isolation", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("does not let one dealership see another's vehicles", async () => {
    const alpha = await registerDealership("Alpha Test", "alpha");
    const beta = await registerDealership("Beta Test", "beta");

    const created = await alpha.post("/api/vehicles", {
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      vin: "ISOLATION00000001",
      price: 18000,
    });
    const vehicleId = created.body.vehicle.id;

    const betaList = await beta.get("/api/vehicles");
    expect(betaList.body.vehicles).toHaveLength(0);

    const betaDirect = await beta.get(`/api/vehicles/${vehicleId}`);
    expect(betaDirect.status).toBe(404); // not 403 — see Milestone 5
  });

  it("does not let one dealership sell another's vehicle", async () => {
    const alpha = await registerDealership("Alpha Sales", "alphasales");
    const beta = await registerDealership("Beta Sales", "betasales");

    const vehicle = await alpha.post("/api/vehicles", {
      make: "Honda",
      model: "Civic",
      year: 2022,
      vin: "ISOLATION00000002",
      price: 21000,
    });

    const betaCustomer = await beta.post("/api/customers", { name: "Beta's Customer" });

    const attempt = await beta.post("/api/sales", {
      vehicleId: vehicle.body.vehicle.id,
      customerId: betaCustomer.body.customer.id,
      salePrice: 20000,
    });

    expect(attempt.status).toBe(404);
  });
});