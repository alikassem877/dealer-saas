import { describe, it, expect } from "vitest";
import { createVehicleSchema } from "@/lib/validation/vehicle";

describe("createVehicleSchema", () => {
  const validInput = {
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    vin: "1HGCM82633A123456",
    price: 20000,
    mileage: 5000,
    color: "White",
  };

  it("accepts valid input", () => {
    expect(createVehicleSchema.safeParse(validInput).success).toBe(true);
  });

  it("trims and uppercases the VIN", () => {
    const result = createVehicleSchema.safeParse({
      ...validInput,
      vin: "  1hgcm82633a123456  ",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.vin).toBe("1HGCM82633A123456");
  });

  it("rejects a VIN that isn't 17 characters", () => {
    expect(createVehicleSchema.safeParse({ ...validInput, vin: "TOO_SHORT" }).success).toBe(false);
  });

  it("rejects a negative price", () => {
    expect(createVehicleSchema.safeParse({ ...validInput, price: -100 }).success).toBe(false);
  });

  it("rejects a year far in the future", () => {
    const result = createVehicleSchema.safeParse({
      ...validInput,
      year: new Date().getFullYear() + 5,
    });
    expect(result.success).toBe(false);
  });

  it("defaults mileage to 0 when omitted", () => {
    const { mileage, ...withoutMileage } = validInput;
    const result = createVehicleSchema.safeParse(withoutMileage);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.mileage).toBe(0);
  });
});