import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guards";
import { ApiError, errorResponse } from "@/lib/api/errors";

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        dealershipId: true,
        dealership: { select: { id: true, name: true, subscriptionStatus: true } },
      },
    });

    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    return NextResponse.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}