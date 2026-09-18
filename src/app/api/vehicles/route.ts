import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse, ApiError } from "@/lib/api/errors";
import { createVehicleSchema } from "@/lib/validation/vehicle";
import { parseOrThrow } from "@/lib/validation/parse";

export async function GET() {
  try {
    const { dealershipId } = await requireDealershipOwner();

    const vehicles = await prisma.vehicle.findMany({
      where: { dealershipId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const body = await request.json();
    const data = parseOrThrow(createVehicleSchema, body);

    const existingVin = await prisma.vehicle.findUnique({
      where: { vin: data.vin },
    });
    if (existingVin) {
      throw new ApiError(409, "A vehicle with this VIN already exists.");
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        dealershipId, // from session, never from the client body
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}