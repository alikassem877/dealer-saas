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

export type CustomerStatus = "LEAD" | "CUSTOMER";

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
};

export type Sale = {
  id: string;
  salePrice: string; // Decimal -> string over JSON, same as Vehicle.price
  saleDate: string;
  notes: string | null;
  createdAt: string;
  vehicle: { make: string; model: string; year: number; vin: string };
  customer: { name: string; email: string | null; phone: string | null };
};