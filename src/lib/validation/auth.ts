import { z } from "zod";

export const registerSchema = z.object({
  dealershipName: z.string().trim().min(2, "Dealership name is too short"),
  dealershipEmail: z.string().trim().toLowerCase().email("Invalid dealership email"),
  ownerName: z.string().trim().min(2, "Name is too short"),
  ownerEmail: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;