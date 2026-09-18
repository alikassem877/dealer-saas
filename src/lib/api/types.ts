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