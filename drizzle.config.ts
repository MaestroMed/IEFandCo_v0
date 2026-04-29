import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) {
  // drizzle-kit reads this synchronously at CLI invocation. Fail loudly so
  // the dev knows to set DATABASE_URL before running push/generate/migrate.
  throw new Error(
    "DATABASE_URL not set. Set it in .env.local (Supabase project URL) before running drizzle-kit."
  );
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;
