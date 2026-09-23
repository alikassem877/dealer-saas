import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { errorResponse, ApiError } from "@/lib/api/errors";
import { parseOrThrow } from "@/lib/validation/parse";

const updateSchema = z.object({
  subscriptionStatus: z.enum(["TRIAL", "ACTIVE", "EXPIRED"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await requireRole(["PLATFORM_OWNER"]);
    const { id } = await params;

    const existing = await prisma.dealership.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "Dealership not found.");

    const data = parseOrThrow(updateSchema, await request.json());

    const dealership = await prisma.dealership.update({ where: { id }, data });
    return NextResponse.json({ dealership });
  } catch (error) {
    return errorResponse(error);
  }
}