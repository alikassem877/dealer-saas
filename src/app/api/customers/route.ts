import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/api/errors";
import { createCustomerSchema } from "@/lib/validation/customer";
import { parseOrThrow } from "@/lib/validation/parse";

export async function GET() {
  try {
    const { dealershipId } = await requireDealershipOwner();

    const customers = await prisma.customer.findMany({
      where: { dealershipId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { dealershipId } = await requireDealershipOwner();
    const body = await request.json();
    const data = parseOrThrow(createCustomerSchema, body);

    const customer = await prisma.customer.create({
      data: {
        ...data,
        email: data.email || null, // convert "" to null before saving
        dealershipId,
      },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}