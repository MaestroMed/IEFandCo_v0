/**
 * Email sending utility.
 * Uses Resend if RESEND_API_KEY is set, otherwise logs to console (dev mode).
 *
 * Setup:
 *   1. Sign up at resend.com (free tier: 3000 emails/month)
 *   2. Verify your domain (iefandco.com)
 *   3. Set env vars: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */

interface EmailPayload {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ subject, html, replyTo }: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@iefandco.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@iefandco.com";

  // Dev fallback: log instead of sending
  if (!apiKey) {
    console.log("[EMAIL — DEV MODE (no RESEND_API_KEY)]", {
      to: toEmail,
      from: fromEmail,
      replyTo,
      subject,
      html,
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
