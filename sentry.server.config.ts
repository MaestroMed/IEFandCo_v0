/**
 * Sentry server-side init.
 *
 * Loaded by `instrumentation.ts` only when `SENTRY_DSN` is configured.
 * Drop the file or unset DSN to disable.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  // PII : we explicitly DON'T send IP / cookies / headers — defense in depth
  // since lead messages may contain sensitive info.
  sendDefaultPii: false,
  // Filter out the noisy DB-not-configured error (expected in dev).
  beforeSend(event, hint) {
    const msg = hint?.originalException instanceof Error ? hint.originalException.message : "";
    if (msg.includes("DATABASE_URL is not configured")) return null;
    return event;
  },
});
