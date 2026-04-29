import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sendEmail, escapeHtml } from "@/lib/email";
import { getServiceBySlug } from "@/data/services";
import { rateLimit, checkOrigin } from "@/lib/rate-limit";
import { randomBytes } from "node:crypto";

interface DevisPayload {
  service?: string;
  description?: string;
  urgence?: string;
  adresse?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  societe?: string;
}

function cuid() {
  return randomBytes(16).toString("hex");
}

export async function POST(req: Request) {
  if (!checkOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Origine non autorisée" }, { status: 403 });
  }
  const rl = await rateLimit(req, "devis", { max: 5, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  try {
    const body = (await req.json()) as DevisPayload;

    const errors: Record<string, string> = {};
    if (!body.service) errors.service = "Requis";
    if (!body.description?.trim()) errors.description = "Requis";
    if (!body.prenom?.trim()) errors.prenom = "Requis";
    if (!body.nom?.trim()) errors.nom = "Requis";
    if (!body.email?.trim()) errors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.email = "Email invalide";
    if (!body.telephone?.trim()) errors.telephone = "Requis";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const serviceTitle = body.service ? getServiceBySlug(body.service)?.title || body.service : "-";

    // Persist to DB
    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "";

    // Higher priority if urgent
    const priority = body.urgence === "urgent" ? "high" : "normal";

    await db.insert(schema.leads).values({
      id: cuid(),
      type: "devis",
      status: "new",
      priority,
      firstName: body.prenom!,
      lastName: body.nom!,
      email: body.email!,
      phone: body.telephone!,
      company: body.societe || null,
      service: body.service || null,
      subject: serviceTitle,
      message: body.description!,
      payloadJson: JSON.stringify({ urgence: body.urgence, adresse: body.adresse }),
      source: "devis_form",
      userAgent,
      ip,
    });

    const html = `
      <h2>Nouvelle demande de devis</h2>
      <h3>Projet</h3>
      <table style="border-collapse: collapse;">
        <tr><td><strong>Service</strong></td><td>${escapeHtml(serviceTitle)}</td></tr>
        <tr><td><strong>Urgence</strong></td><td>${escapeHtml(body.urgence || "-")}</td></tr>
        <tr><td><strong>Adresse</strong></td><td>${escapeHtml(body.adresse || "-")}</td></tr>
      </table>
      <h4>Description</h4>
      <p>${escapeHtml(body.description!).replace(/\n/g, "<br>")}</p>
      <h3>Coordonnees</h3>
      <table style="border-collapse: collapse;">
        <tr><td><strong>Prenom</strong></td><td>${escapeHtml(body.prenom!)}</td></tr>
        <tr><td><strong>Nom</strong></td><td>${escapeHtml(body.nom!)}</td></tr>
        <tr><td><strong>Societe</strong></td><td>${escapeHtml(body.societe || "-")}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(body.email!)}</td></tr>
        <tr><td><strong>Telephone</strong></td><td>${escapeHtml(body.telephone!)}</td></tr>
      </table>
    `;

    await sendEmail({
      subject: `[IEF & CO] Devis — ${serviceTitle} — ${body.prenom} ${body.nom}`,
      html,
      replyTo: body.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DEVIS ROUTE ERROR]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
