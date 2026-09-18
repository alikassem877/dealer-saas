export type DashboardData = {
  vehicles: {
    available: number;
    reserved: number;
    sold: number;
    total: number;
  };
  leads: {
    active: number;
    totalCustomers: number;
  };
  salesThisMonth: {
    count: number;
    revenue: number;
  };
};

export type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: string; // Prisma Decimal comes over JSON as a string — see note below
  mileage: number;
  color: string | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
};