import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse, ApiError } from "@/lib/api/errors";
import { updateVehicleSchema } from "@/lib/validation/vehicle";
import { parseOrThrow } from "@/lib/validation/parse";

type RouteParams = { params: Promise<{ id: string }> };

async function getOwnedVehicleOrThrow(vehicleId: string, dealershipId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle || vehicle.dealershipId !== dealershipId) {
    // Same error for "doesn't exist" and "belongs to someone else" — see explanation
    throw new ApiError(404, "Vehicle not found.");
  }

  return vehicle;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    const vehicle = await getOwnedVehicleOrThrow(id, dealershipId);

    return NextResponse.json({ vehicle });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    const existing = await getOwnedVehicleOrThrow(id, dealershipId);

    if (existing.status === "SOLD") {
      throw new ApiError(400, "Cannot edit a vehicle that has already been sold.");
    }

    const body = await request.json();
    const data = parseOrThrow(updateVehicleSchema, body);

    if (data.vin && data.vin !== existing.vin) {
      const vinTaken = await prisma.vehicle.findUnique({ where: { vin: data.vin } });
      if (vinTaken) {
        throw new ApiError(409, "A vehicle with this VIN already exists.");
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    const existing = await getOwnedVehicleOrThrow(id, dealershipId);

    if (existing.status === "SOLD") {
      throw new ApiError(400, "Cannot delete a vehicle that has already been sold.");
    }

    await prisma.vehicle.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}