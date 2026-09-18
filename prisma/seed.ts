import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean slate — delete in reverse dependency order
  await prisma.sale.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.dealership.deleteMany();

  // Two dealerships — so we can later PROVE tenant isolation works
  const alpha = await prisma.dealership.create({
    data: {
      name: "Alpha Motors",
      email: "contact@alphamotors.com",
      phone: "+961 70 111 222",
      subscriptionStatus: "ACTIVE",
    },
  });

  const beta = await prisma.dealership.create({
    data: {
      name: "Beta Auto Group",
      email: "contact@betaauto.com",
      phone: "+961 70 333 444",
      subscriptionStatus: "TRIAL",
    },
  });

  await prisma.vehicle.createMany({
    data: [
      {
        dealershipId: alpha.id,
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        vin: "ALPHA0000000001",
        price: 18500.0,
        mileage: 32000,
        color: "White",
        status: "AVAILABLE",
      },
      {
        dealershipId: alpha.id,
        make: "BMW",
        model: "X5",
        year: 2021,
        vin: "ALPHA0000000002",
        price: 47900.5,
        mileage: 41000,
        color: "Black",
        status: "RESERVED",
      },
      {
        dealershipId: beta.id,
        make: "Honda",
        model: "Civic",
        year: 2023,
        vin: "BETA00000000001",
        price: 21000.0,
        mileage: 12000,
        color: "Blue",
        status: "AVAILABLE",
      },
    ],
  });

  await prisma.customer.createMany({
    data: [
      {
        dealershipId: alpha.id,
        name: "Karim Haddad",
        email: "karim@example.com",
        phone: "+961 71 555 666",
        status: "LEAD",
      },
      {
        dealershipId: beta.id,
        name: "Rana Khoury",
        email: "rana@example.com",
        phone: "+961 76 777 888",
        status: "CUSTOMER",
      },
    ],
  });

  console.log(`✅ Seeded: ${alpha.name} (${alpha.id})`);
  console.log(`✅ Seeded: ${beta.name} (${beta.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });