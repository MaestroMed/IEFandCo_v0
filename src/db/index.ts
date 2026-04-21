import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

/**
 * SQLite DB client.
 *
 * - Local dev : writes to `.data/iefandco.db`
 * - Vercel serverless : writes to `/tmp/iefandco.db` (ephemeral — data lost on cold start)
 * - Vercel prod with real DB : set DATABASE_URL to `file:/tmp/...` or migrate to Turso/Postgres
 *
 * The lazy init catches all filesystem errors so the build never crashes.
 * Queries will throw at runtime if the DB is unavailable, which is caught
 * by the content adapter (falls back to static data) for public pages.
 */

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) return url.slice(5);

  // On Vercel, cwd is read-only — use /tmp which is writable
  const isVercel = !!process.env.VERCEL;
  const baseDir = isVercel
    ? "/tmp"
    : path.join(process.cwd(), ".data");

  return path.join(baseDir, "iefandco.db");
}

function initDb() {
  const dbPath = resolveDbPath();
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    return drizzle(sqlite, { schema });
  } catch (err) {
    console.warn(`[db] Failed to initialize SQLite at ${dbPath}:`, err instanceof Error ? err.message : err);
    // Return a proxy that throws on any query — the content adapter catches this
    // and falls back to static data. Admin routes will show errors.
    return drizzle(new Database(":memory:"), { schema });
  }
}

export const db = initDb();
export { schema };
