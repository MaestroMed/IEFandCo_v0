/**
 * Sentry browser-side init.
 *
 * Auto-loaded by `@sentry/nextjs` when present. Disabled when
 * NEXT_PUBLIC_SENTRY_DSN is empty.
 */

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    sendDefaultPii: false,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: false })],
  });
}
