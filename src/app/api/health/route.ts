/**
 * Health check endpoint.
 *
 * Verifies that the app can :
 *   - reach the database (one cheap query)
 *   - reach Supabase Storage (config presence — listing the bucket would cost
 *     a remote round-trip we don't need on every probe)
 *
 * Used by uptime monitors (Vercel Uptime, Pingdom, BetterStack) and by the
 * deploy smoke tests in `docs/DEPLOY.md`.
 */

import { NextResponse } from "next/server";
import { db, schema, isDbConfigured } from "@/db";
import { isStorageConfigured } from "@/lib/storage";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HealthReport {
  ok: boolean;
  timestamp: string;
  environment: string;
  checks: {
    database: { configured: boolean; reachable: boolean | null; latencyMs?: number; error?: string };
    storage: { configured: boolean };
  };
  version?: string;
}

export async function GET() {
  const report: HealthReport = {
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    checks: {
      database: { configured: isDbConfigured(), reachable: null },
      storage: { configured: isStorageConfigured() },
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  };

  // DB probe — only attempt if configured. Use a trivial cross-dialect query.
  if (report.checks.database.configured) {
    const start = Date.now();
    try {
      await db.execute(sql`select 1`);
      report.checks.database.reachable = true;
      report.checks.database.latencyMs = Date.now() - start;
    } catch (err) {
      report.checks.database.reachable = false;
      report.checks.database.error = err instanceof Error ? err.message : "unknown";
      report.ok = false;
    }
  }

  // Storage : we only check env presence here. A remote ping every probe
  // would cost more than it earns and could throttle.
  if (!report.checks.storage.configured && process.env.NODE_ENV === "production") {
    report.ok = false;
  }

  // Reference the schema to keep the import live (some bundlers tree-shake
  // unreferenced imports otherwise).
  void schema;

  return NextResponse.json(report, { status: report.ok ? 200 : 503 });
}
