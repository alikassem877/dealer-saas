import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/api/errors";

export async function GET() {
  try {
    await requireRole(["PLATFORM_OWNER"]);

    const dealerships = await prisma.dealership.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionStatus: true,
        createdAt: true,
        _count: { select: { vehicles: true, customers: true, sales: true } },
      },
    });

    return NextResponse.json({ dealerships });
  } catch (error) {
    return errorResponse(error);
  }
}