/**
 * PostgreSQL DB client (Drizzle + postgres-js).
 *
 * - Local dev : set DATABASE_URL to a Postgres URL (Supabase dev project,
 *   local Docker, or any reachable Postgres).
 * - Vercel prod : set DATABASE_URL to the Supabase prod connection string
 *   (use the *Pooler* URL for serverless — port 6543, ?pgbouncer=true).
 *
 * Lazy init : if DATABASE_URL is missing, queries throw at runtime. The
 * content adapter (`src/lib/content.ts`) catches DB errors on public pages
 * and falls back to static `src/data/*.ts` content, so the site keeps
 * rendering even without a DB. Admin routes will surface the error.
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleClient | null = null;
let _warned = false;

function buildClient(): DrizzleClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (!_warned) {
      console.warn(
        "[db] DATABASE_URL is not set — DB queries will fail. Public pages fall back to src/data/*."
      );
      _warned = true;
    }
    throw new Error("DATABASE_URL is not configured");
  }

  // Supabase pooled connection: PgBouncer requires `prepare: false`.
  const isPooler = url.includes("pgbouncer=true") || url.includes(":6543");

  const client = postgres(url, {
    max: isPooler ? 1 : 5,
    prepare: !isPooler,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

function getDb(): DrizzleClient {
  if (_db) return _db;
  _db = buildClient();
  return _db;
}

/**
 * Lazy proxy : `db.insert(...)` etc. forward to the real client only on
 * first use. This keeps `import { db }` cheap at module-init time even
 * when DATABASE_URL is missing (build, dev without DB, etc.).
 */
export const db = new Proxy({} as DrizzleClient, {
  get(_target, prop, receiver) {
    const client = getDb() as unknown as Record<string | symbol, unknown>;
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/** True when DATABASE_URL is set. Use this in content adapters to skip DB
 *  queries entirely when no DB is configured (avoids log noise in dev). */
export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

export { schema };
