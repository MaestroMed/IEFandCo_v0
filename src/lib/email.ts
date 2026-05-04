/**
 * Email sending utility.
 * Uses Resend if RESEND_API_KEY is set in env, or stored in `settings`
 * (key `int:resend-api-key`). Otherwise logs to console (dev mode).
 *
 * Setup:
 *   1. Sign up at resend.com (free tier: 3000 emails/month)
 *   2. Verify your domain (iefandco.com)
 *   3. Either set env vars (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL)
 *      or save the key from Admin > Settings > Integrations.
 */

import { db, schema, isDbConfigured } from "@/db";
import { eq } from "drizzle-orm";

interface EmailPayload {
  /** Recipient(s). When omitted, falls back to CONTACT_TO_EMAIL (used for
   * internal notifications like new leads). Pass an explicit value to send
   * to a customer (e.g. replyToLead). */
  to?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface ResolvedKey {
  apiKey: string | null;
  source: "env" | "db" | null;
}

// Cache the resolved key for a short window to avoid re-querying the DB
// on every send. Env always wins. Cache TTL is short so a rotation in the
// BO is reflected quickly.
let _cached: { key: string | null; source: "env" | "db" | null; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute

async function resolveResendKey(): Promise<ResolvedKey> {
  // Env wins — no DB roundtrip needed when set.
  if (process.env.RESEND_API_KEY) {
    return { apiKey: process.env.RESEND_API_KEY, source: "env" };
  }

  // Cached DB lookup
  const now = Date.now();
  if (_cached && _cached.expiresAt > now) {
    return { apiKey: _cached.key, source: _cached.source };
  }

  if (!isDbConfigured()) {
    _cached = { key: null, source: null, expiresAt: now + CACHE_TTL_MS };
    return { apiKey: null, source: null };
  }

  try {
    const row = (
      await db
        .select()
        .from(schema.settings)
        .where(eq(schema.settings.key, "int:resend-api-key"))
        .limit(1)
    )[0];
    if (row?.valueJson) {
      const parsed = JSON.parse(row.valueJson);
      if (typeof parsed === "string" && parsed.length > 0) {
        _cached = { key: parsed, source: "db", expiresAt: now + CACHE_TTL_MS };
        return { apiKey: parsed, source: "db" };
      }
    }
  } catch {
    // Fall through — DB unavailable, treat as no key configured.
  }

  _cached = { key: null, source: null, expiresAt: now + CACHE_TTL_MS };
  return { apiKey: null, source: null };
}

/** Internal — exposed so tests / admin pages can force a refetch. */
export function _invalidateResendCache() {
  _cached = null;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const { apiKey } = await resolveResendKey();
  const fallbackTo = process.env.CONTACT_TO_EMAIL || "contact@iefandco.com";
  const toEmail = to ?? fallbackTo;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@iefandco.com";

  // Dev fallback: log metadata only (never PII / full HTML body)
  if (!apiKey) {
    console.log("[EMAIL — DEV MODE (no RESEND_API_KEY)]", {
      to: toEmail,
      from: fromEmail,
      replyTo,
      subject,
      htmlBytes: html.length,
    });
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[EMAIL ERROR]", res.status, text);
      return { ok: false, error: `Resend API returned ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[EMAIL EXCEPTION]", err);
    return { ok: false, error: "Network error" };
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
