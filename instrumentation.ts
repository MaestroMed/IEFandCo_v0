/**
 * Next.js instrumentation entry — runs once per server process at boot.
 *
 * Wires Sentry only when SENTRY_DSN is configured. Without that env var the
 * file is a complete no-op so dev / preview deploys don't pay the cost.
 *
 * Reference : https://nextjs.org/docs/app/guides/instrumentation
 */

export async function register() {
  if (!process.env.SENTRY_DSN) return;

  // Lazy-load to keep cold-start small in the no-DSN path.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Forward unhandled request errors to Sentry (when configured).
// Used by the App Router's `onRequestError` hook in Next.js 15.
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string | string[] | undefined> },
  context: { routerKind: "Pages Router" | "App Router"; routePath: string; routeType: "render" | "route" | "action" | "middleware" },
) {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(err, request, context);
}
