import { PrismaClient } from "@prisma/client";
import { withTransientRetry } from "@/lib/db-retry";

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return undefined;
  }

  const join = url.includes("?") ? "&" : "?";
  const extras: string[] = [];
  if (!/[?&]connect_timeout=/.test(url)) {
    extras.push("connect_timeout=15");
  }
  if (!/[?&]pool_timeout=/.test(url)) {
    extras.push("pool_timeout=20");
  }
  return extras.length ? `${url}${join}${extras.join("&")}` : url;
}

function createPrisma() {
  const url = databaseUrl();
  const client = new PrismaClient({
    ...(url ? { datasourceUrl: url } : {}),
    log: ["error"],
  });

  return client.$extends({
    query: {
      $allOperations({ args, query }) {
        // Neon and Render Free both sleep. The first query after idle often
        // fails once, then succeeds — retry here so the user does not.
        return withTransientRetry(() => query(args));
      },
    },
  });
}

type DbClient = ReturnType<typeof createPrisma>;

const globalForPrisma = globalThis as unknown as { prisma?: DbClient };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function warmDatabase() {
  void withTransientRetry(() => prisma.$connect()).catch(() => {
    // First user action still retries through the query extension.
  });
}
