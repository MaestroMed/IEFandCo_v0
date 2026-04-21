"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { sendEmail, escapeHtml } from "@/lib/email";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { LEAD_STATUSES } from "./constants";

function cuid() {
  return randomBytes(16).toString("hex");
}

async function logEvent(leadId: string, type: string, actorId: string | null, payload?: Record<string, unknown>) {
  await db.insert(schema.leadEvents).values({
    id: cuid(),
    leadId,
    type,
    actorId,
    payloadJson: payload ? JSON.stringify(payload) : null,
  });
}

type LeadStatus = typeof LEAD_STATUSES[number];

export async function updateLeadStatus(leadId: string, status: LeadStatus, lossReason?: string) {
  const user = await requireAdmin();
  const prev = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId)).limit(1);
  if (!prev[0]) return { ok: false, error: "Lead introuvable" };

  await db.update(schema.leads)
    .set({ status, lossReason: status === "lost" ? lossReason || null : null, updatedAt: new Date() })
    .where(eq(schema.leads.id, leadId));

  await logEvent(leadId, "status_change", user.id, { from: prev[0].status, to: status, lossReason });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function assignLead(leadId: string, userId: string | null) {
  const user = await requireAdmin();
  await db.update(schema.leads)
    .set({ assignedTo: userId, updatedAt: new Date() })
    .where(eq(schema.leads.id, leadId));
  await logEvent(leadId, "assignment", user.id, { to: userId });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function addLeadNote(leadId: string, content: string) {
  if (!content.trim()) return { ok: false, error: "Note vide" };
  const user = await requireAdmin();
  await logEvent(leadId, "note", user.id, { content });
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function replyToLead(leadId: string, subject: string, body: string) {
  if (!subject.trim() || !body.trim()) return { ok: false, error: "Sujet et message requis" };
  const user = await requireAdmin();

  const lead = (await db.select().from(schema.leads).where(eq(schema.leads.id, leadId)).limit(1))[0];
  if (!lead) return { ok: false, error: "Lead introuvable" };

  const html = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <p>Bonjour ${escapeHtml(lead.firstName)},</p>
      <div style="white-space: pre-wrap;">${escapeHtml(body)}</div>
      <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        ${escapeHtml(user.name)} · IEF & CO<br>
        01 34 05 87 03 · contact@iefandco.com
      </p>
    </div>
  `;

  const result = await sendEmail({
    subject,
    html,
    replyTo: "contact@iefandco.com",
  });

  // Log to email log regardless of success (track failures)
  await db.insert(schema.emailLog).values({
    id: cuid(),
    toAddress: lead.email,
    fromAddress: process.env.CONTACT_FROM_EMAIL || "noreply@iefandco.com",
    subject,
    bodyHtml: html,
    templateKey: null,
    leadId,
    sentBy: user.id,
    status: result.ok ? "sent" : "failed",
    errorMessage: result.ok ? null : (result.error || "Envoi echoue"),
  });

  if (!result.ok) return { ok: false, error: result.error || "Envoi echoue" };

  await logEvent(leadId, "email_sent", user.id, { subject, body, to: lead.email });
  if (lead.status === "new") {
    await db.update(schema.leads)
      .set({ status: "contacted", updatedAt: new Date() })
      .where(eq(schema.leads.id, leadId));
    await logEvent(leadId, "status_change", user.id, { from: "new", to: "contacted", reason: "auto_after_reply" });
  }

  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function deleteLead(leadId: string) {
  await requireAdmin();
  await db.delete(schema.leads).where(eq(schema.leads.id, leadId));
  revalidatePath("/admin/leads");
  return { ok: true };
}

/* ─────────── Bulk actions ─────────── */

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function bulkUpdateStatus(ids: string[], status: LeadStatus) {
  if (!ids.length) return { ok: false as const, error: "Aucun lead selectionne" };
  const user = await requireAdmin();
  try {
    await db
      .update(schema.leads)
      .set({ status, updatedAt: new Date() })
      .where(inArray(schema.leads.id, ids));
    for (const leadId of ids) {
      await logEvent(leadId, "status_change", user.id, { to: status, bulk: true });
    }
    revalidatePath("/admin/leads");
    return { ok: true as const, count: ids.length };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function bulkAssign(ids: string[], userId: string | null) {
  if (!ids.length) return { ok: false as const, error: "Aucun lead selectionne" };
  const user = await requireAdmin();
  try {
    await db
      .update(schema.leads)
      .set({ assignedTo: userId, updatedAt: new Date() })
      .where(inArray(schema.leads.id, ids));
    for (const leadId of ids) {
      await logEvent(leadId, "assignment", user.id, { to: userId, bulk: true });
    }
    revalidatePath("/admin/leads");
    return { ok: true as const, count: ids.length };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function bulkDelete(ids: string[]) {
  if (!ids.length) return { ok: false as const, error: "Aucun lead selectionne" };
  await requireAdmin();
  try {
    await db.delete(schema.leads).where(inArray(schema.leads.id, ids));
    revalidatePath("/admin/leads");
    return { ok: true as const, count: ids.length };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function exportLeadsCSV(ids: string[]) {
  if (!ids.length) return { ok: false as const, error: "Aucun lead selectionne" };
  await requireAdmin();
  try {
    const rows = await db.select().from(schema.leads).where(inArray(schema.leads.id, ids));
    const headers = [
      "id", "type", "status", "priority", "firstName", "lastName", "email", "phone",
      "company", "service", "subject", "message", "source", "tags", "lossReason",
      "receivedAt", "updatedAt",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.id,
          r.type,
          r.status,
          r.priority,
          r.firstName,
          r.lastName,
          r.email,
          r.phone,
          r.company,
          r.service,
          r.subject,
          r.message,
          r.source,
          r.tags,
          r.lossReason,
          r.receivedAt instanceof Date ? r.receivedAt.toISOString() : r.receivedAt,
          r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
        ].map(csvEscape).join(","),
      );
    }
    const csv = lines.join("\n");
    return { ok: true as const, csv, count: rows.length };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

