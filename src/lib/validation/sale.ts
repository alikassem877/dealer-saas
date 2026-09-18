import { z } from "zod";

export const createSaleSchema = z.object({
  vehicleId: z.string().min(1, "vehicleId is required"),
  customerId: z.string().min(1, "customerId is required"),
  salePrice: z.number().positive("Sale price must be greater than 0"),
  saleDate: z.string().datetime().optional(), // ISO string, e.g. "2026-09-19T00:00:00.000Z"
  notes: z.string().max(1000).optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;