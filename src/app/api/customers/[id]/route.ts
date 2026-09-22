import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse, ApiError } from "@/lib/api/errors";
import { updateCustomerSchema } from "@/lib/validation/customer";
import { parseOrThrow } from "@/lib/validation/parse";

type RouteParams = { params: Promise<{ id: string }> };

async function getOwnedCustomerOrThrow(
  customerId: string,
  dealershipId: string
) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer || customer.dealershipId !== dealershipId) {
    throw new ApiError(404, "Customer not found.");
  }

  return customer;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    const [customer, sales] = await Promise.all([
      getOwnedCustomerOrThrow(id, dealershipId),
      prisma.sale.findMany({
        where: { customerId: id },
        include: {
          vehicle: {
            select: {
              make: true,
              model: true,
              year: true,
            },
          },
        },
        orderBy: { saleDate: "desc" },
      }),
    ]);

    return NextResponse.json({ customer, sales });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    await getOwnedCustomerOrThrow(id, dealershipId);

    const body = await request.json();
    const data = parseOrThrow(updateCustomerSchema, body);

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        ...(data.email !== undefined ? { email: data.email || null } : {}),
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const { id } = await params;

    await getOwnedCustomerOrThrow(id, dealershipId);

    const saleCount = await prisma.sale.count({
      where: { customerId: id },
    });

    if (saleCount > 0) {
      throw new ApiError(
        400,
        "Cannot delete a customer with existing sales history."
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}