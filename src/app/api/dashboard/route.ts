import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDealershipOwner } from "@/lib/auth/guards";
import { errorResponse } from "@/lib/api/errors";

export async function GET() {
  try {
    const { dealershipId } = await requireDealershipOwner();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      vehiclesByStatus,
      activeLeadCount,
      totalCustomerCount,
      salesThisMonth,
    ] = await Promise.all([
      // Vehicle counts grouped by status, in one query
      prisma.vehicle.groupBy({
        by: ["status"],
        where: { dealershipId },
        _count: { _all: true },
      }),

      // Leads still in progress
      prisma.customer.count({
        where: { dealershipId, status: "LEAD" },
      }),

      // Total customers (leads + converted)
      prisma.customer.count({
        where: { dealershipId },
      }),

      // Sales this calendar month: count + total revenue in one query
      prisma.sale.aggregate({
        where: { dealershipId, saleDate: { gte: startOfMonth } },
        _count: { _all: true },
        _sum: { salePrice: true },
      }),
    ]);

    // groupBy returns an array like [{status: "AVAILABLE", _count: {_all: 5}}, ...]
    // Convert it into a simple object so the frontend doesn't need to loop/search it
    const vehicleCounts = {
      AVAILABLE: 0,
      RESERVED: 0,
      SOLD: 0,
    };
    for (const row of vehiclesByStatus) {
      vehicleCounts[row.status] = row._count._all;
    }

    return NextResponse.json({
      vehicles: {
        available: vehicleCounts.AVAILABLE,
        reserved: vehicleCounts.RESERVED,
        sold: vehicleCounts.SOLD,
        total: vehicleCounts.AVAILABLE + vehicleCounts.RESERVED + vehicleCounts.SOLD,
      },
      leads: {
        active: activeLeadCount,
        totalCustomers: totalCustomerCount,
      },
      salesThisMonth: {
        count: salesThisMonth._count._all,
        revenue: salesThisMonth._sum.salePrice ?? 0,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}