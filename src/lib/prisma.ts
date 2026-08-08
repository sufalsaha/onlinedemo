import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { promises as dns } from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Reuse the client across dev HMR reloads, otherwise every edit leaks a new
// connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
