/**
 * Middleware — handles 301/302 redirects from the database `redirects` table.
 *
 * The admin can manage redirects via /admin/seo/redirects. They take effect
 * immediately on the next request — no redeploy needed.
 *
 * Runtime: nodejs (required to use better-sqlite3 in dev, postgres-js in prod
 * via Drizzle). Edge runtime is not compatible with our Drizzle adapters.
 */

import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema, isDbConfigured } from "@/db";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Quick guard: home doesn't need a DB lookup, neither does anything if DB
  // is not configured (avoids per-request errors in dev).
  if (path === "/" || path.length > 256 || !isDbConfigured()) {
    return NextResponse.next();
  }

  try {
    const rows = await db
      .select({
        toPath: schema.redirects.toPath,
        statusCode: schema.redirects.statusCode,
      })
      .from(schema.redirects)
      .where(eq(schema.redirects.fromPath, path))
      .limit(1);

    if (rows[0]) {
      const url = req.nextUrl.clone();
      const target = rows[0].toPath;
      // Allow absolute targets (rare) and relative ones (default)
      if (target.startsWith("http://") || target.startsWith("https://")) {
        return NextResponse.redirect(new URL(target), rows[0].statusCode || 301);
      }
      url.pathname = target;
      url.search = "";
      return NextResponse.redirect(url, rows[0].statusCode || 301);
    }
  } catch (err) {
    // Fail-open: never block a request because of a redirect lookup
    console.error("[middleware redirects]", err);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Match all paths EXCEPT _next/, favicon, api, admin, files with extensions
    "/((?!_next/static|_next/image|favicon\\.ico|api/|admin/|.*\\.).*)",
  ],
};
