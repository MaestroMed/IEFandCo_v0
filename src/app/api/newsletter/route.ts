import { NextResponse } from "next/server";
import { sendEmail, escapeHtml } from "@/lib/email";

/**
 * POST /api/newsletter
 * Body: { email: string }
 *
 * For now: email the subscription to CONTACT_TO_EMAIL so the client can pipe it
 * into their newsletter tool (Resend broadcast, Buttondown, MailerLite).
 * Can be upgraded to direct Resend Audiences API later.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const safeEmail = escapeHtml(email);
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1A1A1A; margin: 0 0 16px;">Nouvelle inscription newsletter</h2>
        <p style="color: #555; line-height: 1.6;">
          Un nouveau contact s'est inscrit à la newsletter IEF & CO.
        </p>
        <div style="background: #F3F2EF; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email :</strong> ${safeEmail}</p>
          <p style="margin: 8px 0 0;"><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
        </div>
        <p style="color: #888; font-size: 13px;">
          À ajouter manuellement à la liste de diffusion (Resend Audiences, Buttondown, etc.).
        </p>
      </div>
    `;

    // Fire-and-forget notification to admin — don't fail the signup if email fails
    sendEmail({
      subject: `[Newsletter] Nouvelle inscription : ${email}`,
      html,
    }).catch((e) => console.error("Newsletter email error:", e));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Newsletter route error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
