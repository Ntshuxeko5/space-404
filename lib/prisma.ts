import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as any;

const __PRISMA_INIT_LOGGED = Symbol.for("__space404_prisma_init_logged");

function createPrismaClient(): PrismaClient {
  const g = globalThis as any;
  const dbUrl = process.env.DATABASE_URL || "";
  const masked = dbUrl.length
    ? dbUrl.replace(
        /:([^:@]+)@/,
        (_, pwd) => `:${"*".repeat(Math.min(pwd.length, 8))}@`,
      )
    : "<EMPTY>";

  const isVercelRuntime = !!process.env.VERCEL_ENV || !!process.env.VERCEL;
  const wantInitDiag = !isVercelRuntime
    ? process.env.NODE_ENV === "development"
    : process.env.NODE_ENV === "production"
      ? false
      : true;

  if (wantInitDiag && !g[__PRISMA_INIT_LOGGED]) {
    g[__PRISMA_INIT_LOGGED] = true;
    const host = masked.split("@")[1]?.split("/")[0] || "unknown";
    console.log(`[prisma] init host=${host}`);
  }

  if (!dbUrl) {
    console.error(
      "[prisma] FATAL: process.env.DATABASE_URL is empty or not set. Fix in Vercel -> Project -> Settings -> Environment Variables and ensure Production checkbox is ticked. Redeploy with Clear Cache.",
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["warn", "error"],
    errorFormat: "pretty",
  });
}

export const prisma: PrismaClient =
  globalForPrisma.__prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;
