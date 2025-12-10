import { PrismaClient } from "@/lib/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({ connectionString });

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn", "info"]
        : ["error"],
    errorFormat: "pretty",
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
