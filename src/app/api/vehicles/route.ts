import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/api/errors";

export async function GET() {
  try {
    const { dealershipId } = await requireDealershipOwner();

    const vehicles = await prisma.vehicle.findMany({
      where: { dealershipId }, // <-- the whole security model lives in this one line
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    return errorResponse(error);
  }
}