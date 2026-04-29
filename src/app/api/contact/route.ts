import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sendEmail, escapeHtml } from "@/lib/email";
import { rateLimit, checkOrigin } from "@/lib/rate-limit";
import { randomBytes } from "node:crypto";

interface ContactPayload {
  prenom?: string;
  nom?: string;
  societe?: string;
  telephone?: string;
  email?: string;
  service?: string;
  message?: string;
}

function cuid() {
  return randomBytes(16).toString("hex");
}

export async function POST(req: Request) {
  if (!checkOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine non autorisée" }, { status: 403 });
  }
  const rl = await rateLimit(req, "contact", { max: 5, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  try {
    const body = (await req.json()) as ContactPayload;

    const errors: Record<string, string> = {};
    if (!body.prenom?.trim()) errors.prenom = "Requis";
    if (!body.nom?.trim()) errors.nom = "Requis";
    if (!body.email?.trim()) errors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.email = "Email invalide";
    if (!body.telephone?.trim()) errors.telephone = "Requis";
    if (!body.message?.trim()) errors.message = "Requis";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // Persist to DB
    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "";
    await db.insert(schema.leads).values({
      id: cuid(),
      type: "contact",
      status: "new",
      firstName: body.prenom!,
      lastName: body.nom!,
      email: body.email!,
      phone: body.telephone!,
      company: body.societe || null,
      service: body.service || null,
      message: body.message!,
      source: "contact_form",
      userAgent,
      ip,
    });

    // Send notification email
    const html = `
      <h2>Nouveau message de contact</h2>
      <table style="border-collapse: collapse;">
        <tr><td><strong>Prenom</strong></td><td>${escapeHtml(body.prenom!)}</td></tr>
        <tr><td><strong>Nom</strong></td><td>${escapeHtml(body.nom!)}</td></tr>
        <tr><td><strong>Societe</strong></td><td>${escapeHtml(body.societe || "-")}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(body.email!)}</td></tr>
        <tr><td><strong>Telephone</strong></td><td>${escapeHtml(body.telephone!)}</td></tr>
        <tr><td><strong>Service</strong></td><td>${escapeHtml(body.service || "-")}</td></tr>
      </table>
      <h3>Message</h3>
      <p>${escapeHtml(body.message!).replace(/\n/g, "<br>")}</p>
    `;
    await sendEmail({
      subject: `[IEF & CO] Contact — ${body.prenom} ${body.nom}`,
      html,
      replyTo: body.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT ROUTE ERROR]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
