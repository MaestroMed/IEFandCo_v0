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

/**
 * Hosts allowed as absolute redirect targets (defends against open-redirect
 * attacks where an admin would accidentally — or maliciously — register a
 * redirect pointing at an external phishing domain).
 *
 * Defaults to the configured site URL host. Can be extended via the
 * `ALLOWED_REDIRECT_HOSTS` env var (comma-separated list of hosts).
 */
function allowedRedirectHosts(): Set<string> {
  const hosts = new Set<string>();
  const envSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (envSite) {
    try {
      hosts.add(new URL(envSite).host);
    } catch {
      /* ignore */
    }
  } else {
    hosts.add("iefandco.com");
    hosts.add("www.iefandco.com");
  }
  const extra = process.env.ALLOWED_REDIRECT_HOSTS;
  if (extra) {
    for (const h of extra.split(",").map((s) => s.trim()).filter(Boolean)) hosts.add(h);
  }
  return hosts;
}

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
      // Absolute target : only allow when the host is whitelisted
      if (target.startsWith("http://") || target.startsWith("https://")) {
        try {
          const targetUrl = new URL(target);
          const allowed = allowedRedirectHosts();
          if (!allowed.has(targetUrl.host)) {
            console.warn("[middleware] blocked open redirect to", targetUrl.host);
            return NextResponse.next();
          }
          return NextResponse.redirect(targetUrl, rows[0].statusCode || 301);
        } catch {
          return NextResponse.next();
        }
      }
      // Relative target : always safe (resolves on same origin)
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
