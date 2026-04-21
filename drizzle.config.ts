import type { Config } from "drizzle-kit";
import path from "node:path";

const DB_PATH = process.env.DATABASE_URL?.startsWith("file:")
  ? process.env.DATABASE_URL.slice(5)
  : path.join(process.cwd(), ".data", "iefandco.db");

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: { url: DB_PATH },
} satisfies Config;
