import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.includes("_test")) {
  throw new Error(
    "Refusing to run tests: DATABASE_URL doesn't look like a test database. " +
      "Did you forget to load .env.test?"
  );
}

const adapter = new PrismaPg({ connectionString });
export const testPrisma = new PrismaClient({ adapter });

export async function resetDb() {
  await testPrisma.sale.deleteMany();
  await testPrisma.vehicle.deleteMany();
  await testPrisma.customer.deleteMany();
  await testPrisma.user.deleteMany();
  await testPrisma.dealership.deleteMany();
}