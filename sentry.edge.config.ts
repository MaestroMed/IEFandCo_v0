/**
 * Sentry edge runtime init (middleware + edge routes).
 * Same notes as the server config — opt-in via SENTRY_DSN.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
