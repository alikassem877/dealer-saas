import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb, testPrisma } from "../helpers/testDb";
import { TestClient } from "../helpers/testClient";

describe("sales flow", () => {
  let client: TestClient;

  beforeEach(async () => {
    await resetDb();
    client = new TestClient();
    await client.post("/api/auth/register", {
      dealershipName: "Sales Test Motors",
      dealershipEmail: "salestest@test.com",
      ownerName: "Owner",
      ownerEmail: "salesowner@test.com",
      password: "password123",
    });
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("marks the vehicle SOLD and promotes a LEAD to CUSTOMER", async () => {
    const vehicle = await client.post("/api/vehicles", {
      make: "Mazda",
      model: "CX-5",
      year: 2024,
      vin: "SALESFLOW00000001",
      price: 29000,
    });
    const lead = await client.post("/api/customers", { name: "Joe Buyer", status: "LEAD" });

    const sale = await client.post("/api/sales", {
      vehicleId: vehicle.body.vehicle.id,
      customerId: lead.body.customer.id,
      salePrice: 28500,
    });
    expect(sale.status).toBe(201);

    const updatedVehicle = await client.get(`/api/vehicles/${vehicle.body.vehicle.id}`);
    expect(updatedVehicle.body.vehicle.status).toBe("SOLD");

    const updatedCustomer = await client.get(`/api/customers/${lead.body.customer.id}`);
    expect(updatedCustomer.body.customer.status).toBe("CUSTOMER");
  });

  it("rejects selling the same vehicle twice", async () => {
    const vehicle = await client.post("/api/vehicles", {
      make: "Kia",
      model: "Sportage",
      year: 2023,
      vin: "SALESFLOW00000002",
      price: 25000,
    });
    const customer = await client.post("/api/customers", { name: "First Buyer" });

    const first = await client.post("/api/sales", {
      vehicleId: vehicle.body.vehicle.id,
      customerId: customer.body.customer.id,
      salePrice: 24500,
    });
    expect(first.status).toBe(201);

    const second = await client.post("/api/sales", {
      vehicleId: vehicle.body.vehicle.id,
      customerId: customer.body.customer.id,
      salePrice: 24000,
    });
    expect(second.status).toBe(400);
  });

  it("prevents editing or deleting a sold vehicle", async () => {
    const vehicle = await client.post("/api/vehicles", {
      make: "Ford",
      model: "Focus",
      year: 2021,
      vin: "SALESFLOW00000003",
      price: 15000,
    });
    const customer = await client.post("/api/customers", { name: "Buyer" });

    await client.post("/api/sales", {
      vehicleId: vehicle.body.vehicle.id,
      customerId: customer.body.customer.id,
      salePrice: 14500,
    });

    expect(
      (await client.patch(`/api/vehicles/${vehicle.body.vehicle.id}`, { price: 1 })).status
    ).toBe(400);

    expect((await client.delete(`/api/vehicles/${vehicle.body.vehicle.id}`)).status).toBe(400);
  });
});