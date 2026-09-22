import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional(),
  notes: z.string().trim().max(1000).optional(),
  status: z.enum(["LEAD", "CUSTOMER"]).default("LEAD"),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;