import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse, ApiError } from "@/lib/api/errors";
import { createSaleSchema } from "@/lib/validation/sale";
import { parseOrThrow } from "@/lib/validation/parse";

export async function GET() {
  try {
    const { dealershipId } = await requireDealershipOwner();

    const sales = await prisma.sale.findMany({
      where: { dealershipId },
      include: {
        vehicle: { select: { make: true, model: true, year: true, vin: true } },
        customer: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { saleDate: "desc" },
    });

    return NextResponse.json({ sales });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const body = await request.json();
    const data = parseOrThrow(createSaleSchema, body);

    const sale = await prisma.$transaction(async (tx) => {
      // 1. Fetch and verify the vehicle — ownership AND availability
      const vehicle = await tx.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicle || vehicle.dealershipId !== dealershipId) {
        throw new ApiError(404, "Vehicle not found.");
      }

      if (vehicle.status !== "AVAILABLE") {
        throw new ApiError(
          400,
          `This vehicle is already ${vehicle.status.toLowerCase()} and cannot be sold.`
        );
      }

      // 2. Fetch and verify the customer — ownership only
      const customer = await tx.customer.findUnique({
        where: { id: data.customerId },
      });

      if (!customer || customer.dealershipId !== dealershipId) {
        throw new ApiError(404, "Customer not found.");
      }

      // 3. Mark the vehicle SOLD
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: "SOLD" },
      });

      // 4. If the customer was still a LEAD, promote them to CUSTOMER
      if (customer.status === "LEAD") {
        await tx.customer.update({
          where: { id: customer.id },
          data: { status: "CUSTOMER" },
        });
      }

      // 5. Create the sale record
      return tx.sale.create({
        data: {
          dealershipId,
          vehicleId: vehicle.id,
          customerId: customer.id,
          salePrice: data.salePrice,
          saleDate: data.saleDate ? new Date(data.saleDate) : undefined,
          notes: data.notes,
        },
      });
    });

    return NextResponse.json({ sale }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}