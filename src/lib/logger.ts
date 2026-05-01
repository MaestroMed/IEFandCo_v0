/**
 * Tiny structured logger.
 *
 * Wraps `console.log/warn/error` with a JSON envelope so Vercel + downstream
 * log processors (Sentry, Logflare, Better Stack) can ingest and filter the
 * output. No external dep — keeps cold-start cost ~zero.
 *
 * Usage :
 *   import { logger } from "@/lib/logger";
 *   logger.info("contact.submit", { leadId, source: "form" });
 *   logger.error("anthropic.api", err, { status: 502 });
 */

type Level = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

function emit(level: Level, event: string, context?: LogContext, err?: unknown) {
  const payload: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    event,
    ...(context ?? {}),
  };
  if (err) {
    if (err instanceof Error) {
      payload.error = {
        name: err.name,
        message: err.message,
        // stack only in non-prod or when explicitly debugging
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      };
    } else {
      payload.error = String(err);
    }
  }
  // Always emit through the matching console.* so Vercel keeps log levels
  // aligned with its dashboard filters.
  const fn =
    level === "debug"
      ? console.debug
      : level === "info"
        ? console.info
        : level === "warn"
          ? console.warn
          : console.error;
  fn(JSON.stringify(payload));
}

export const logger = {
  debug(event: string, context?: LogContext) {
    if (process.env.NODE_ENV === "production") return;
    emit("debug", event, context);
  },
  info(event: string, context?: LogContext) {
    emit("info", event, context);
  },
  warn(event: string, context?: LogContext, err?: unknown) {
    emit("warn", event, context, err);
  },
  error(event: string, err: unknown, context?: LogContext) {
    emit("error", event, context, err);
  },
};
