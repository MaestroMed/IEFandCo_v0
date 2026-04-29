/**
 * Rate limiting + origin check for public POST endpoints.
 *
 * Uses the application database (`rate_limits` table) so we don't need
 * an external KV service. Works on SQLite (dev) and Postgres (prod).
 *
 * Window-based counter: a key is `${endpoint}:${ip}:${windowStart}`,
 * the row is upserted on each request, and we reject when the count
 * exceeds the limit for the current window.
 *
 * Fail-open : if the DB is unreachable, requests are allowed (we don't
 * want to take down a contact form because of a transient DB blip).
 */

import { sql } from "drizzle-orm";
import { db, schema } from "@/db";

export interface RateLimitOptions {
  max: number;
  windowSec: number;
}

const DEFAULT: RateLimitOptions = { max: 5, windowSec: 60 };

export async function rateLimit(
  req: Request,
  endpoint: string,
  opts: RateLimitOptions = DEFAULT
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const ip = getClientIp(req);
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / opts.windowSec) * opts.windowSec;
  const key = `${endpoint}:${ip}:${windowStart}`;

  try {
    const result = await db
      .insert(schema.rateLimits)
      .values({ key, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: schema.rateLimits.key,
        set: { count: sql`${schema.rateLimits.count} + 1` },
      })
      .returning({ count: schema.rateLimits.count });

    const count = result[0]?.count ?? 1;
    if (count > opts.max) {
      return { allowed: false, retryAfter: opts.windowSec - (now - windowStart) };
    }
    return { allowed: true };
  } catch (err) {
    console.error("[rate-limit]", err);
    return { allowed: true };
  }
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Origin check : reject requests that don't come from our own site.
 * Defends against trivial CSRF (form submitted from evil.com).
 */
export function checkOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iefandco.com";
  let expectedHost = "iefandco.com";
  try {
    expectedHost = new URL(siteUrl).host;
  } catch {
    /* keep default */
  }

  const candidates: string[] = [expectedHost];
  if (host) candidates.push(host);
  if (process.env.NODE_ENV !== "production") {
    candidates.push("localhost:3000", "127.0.0.1:3000");
  }
  if (host && (host.endsWith(".vercel.app") || host.endsWith(".iefandco.com"))) {
    candidates.push(host);
  }

  const sourceHostFrom = (raw: string): string | null => {
    try {
      return new URL(raw).host;
    } catch {
      return null;
    }
  };

  if (origin) {
    const sourceHost = sourceHostFrom(origin);
    return sourceHost !== null && candidates.includes(sourceHost);
  }
  if (referer) {
    const sourceHost = sourceHostFrom(referer);
    return sourceHost !== null && candidates.includes(sourceHost);
  }
  // No Origin/Referer = likely curl/script. Reject in prod, allow in dev.
  return process.env.NODE_ENV !== "production";
}
