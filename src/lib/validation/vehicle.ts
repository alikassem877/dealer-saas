import { z } from "zod";

const currentYear = new Date().getFullYear();

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, "Make is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  year: z
    .number()
    .int()
    .min(1980, "Year seems too old")
    .max(currentYear + 1, "Year can't be in the future"),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .length(17, "VIN must be exactly 17 characters"),
  price: z.number().positive("Price must be greater than 0"),
  mileage: z.number().int().nonnegative().default(0),
  color: z.string().trim().max(30).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;