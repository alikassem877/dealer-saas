import { getSession } from "./session";
import { ApiError } from "@/lib/api/errors";
import type { TokenPayload } from "./jwt";

/**
 * Throws 401 if not logged in. Otherwise returns the session payload.
 */
export async function requireAuth(): Promise<TokenPayload> {
  const session = await getSession();
  if (!session) {
    throw new ApiError(401, "You must be logged in.");
  }
  return session;
}

/**
 * Throws 401 if not logged in, 403 if logged in but wrong role.
 * Returns the session payload if the role matches.
 */
export async function requireRole(
  allowedRoles: TokenPayload["role"][]
): Promise<TokenPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new ApiError(403, "You do not have permission to do this.");
  }
  return session;
}

/**
 * For DEALERSHIP_OWNER routes specifically: requires the role AND
 * guarantees dealershipId is a non-null string, so calling code
 * never has to null-check it again.
 */
export async function requireDealershipOwner(): Promise<{
  userId: string;
  dealershipId: string;
}> {
  const session = await requireRole(["DEALERSHIP_OWNER"]);

  if (!session.dealershipId) {
    // Should never happen by construction, but guard anyway — see explanation below
    throw new ApiError(500, "Dealership owner has no dealership assigned.");
  }

  return { userId: session.userId, dealershipId: session.dealershipId };
}