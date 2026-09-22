import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

export type TokenPayload = {
  userId: string;
  role: "PLATFORM_OWNER" | "DEALERSHIP_OWNER";
  dealershipId: string | null;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}