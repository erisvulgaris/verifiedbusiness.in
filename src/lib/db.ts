import { PrismaClient, Prisma } from "@prisma/client";

/**
 * Prisma client singleton with env-aware logging.
 *
 * Logging levels:
 *  - dev:  query + info + warn + error (full visibility while developing)
 *  - prod: warn + error only (quiet, performant)
 *
 * The client is cached on globalThis to prevent exhausting DB connections
 * during Next.js hot reload in development.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const isDev = process.env.NODE_ENV !== "production";
  const logLevels: Prisma.LogLevel[] = isDev
    ? ["query", "warn", "error"]
    : ["warn", "error"];

  return new PrismaClient({
    log: logLevels,
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/**
 * Graceful shutdown — close the DB connection when the process exits.
 * Prevents connection leaks in serverless and long-running containers.
 */
if (!globalForPrisma.prisma) {
  const handleClose = async () => {
    try {
      await db.$disconnect();
    } catch {
      // best-effort
    }
  };
  process.on("beforeExit", handleClose);
  process.on("SIGINT", () => {
    void handleClose().finally(() => process.exit(0));
  });
  process.on("SIGTERM", () => {
    void handleClose().finally(() => process.exit(0));
  });
}
