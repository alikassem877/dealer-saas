import { cookies } from "next/headers";
import { verifyToken, type TokenPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "session_token";

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}