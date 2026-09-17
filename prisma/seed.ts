import "dotenv/config"; // 👈 Chargi .env file
import { hashPassword } from "@/app/lib/auth";
import { Role, PrismaClient } from "@/app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Create PostgreSQL Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Pass Adapter to PrismaClient
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const engineering = await prisma.team.create({
    data: {
      name: "Engineering",
      description: "Software development team",
      code: "ENG",
    },
  });

  const design = await prisma.team.create({
    data: {
      name: "Design",
      description: "UI/UX design team",
      code: "DES",
    },
  });

  const marketing = await prisma.team.create({
    data: {
      name: "Marketing",
      description: "Marketing team",
      code: "MKT",
    },
  });

  const password = await hashPassword("123456");

  // Create Users
  await prisma.user.createMany({
    data: [
      {
        name: "John Manager",
        email: "john@company.com",
        password,
        role: Role.MANAGER,
        teamId: engineering.id,
      },
      {
        name: "Jane User",
        email: "jane@company.com",
        password,
        role: Role.USER,
        teamId: engineering.id,
      },
      {
        name: "Mike User",
        email: "mike@company.com",
        password,
        role: Role.USER,
        teamId: design.id,
      },
      {
        name: "Sarah User",
        email: "sarah@company.com",
        password,
        role: Role.USER,
        teamId: marketing.id,
      },
    ],
  });

  console.log("Database seeded successfully! 🌱");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
