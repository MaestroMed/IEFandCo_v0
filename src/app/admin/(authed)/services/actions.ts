"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

function id() {
  return randomBytes(16).toString("hex");
}

type ServiceInput = {
  title: string;
  shortTitle: string;
  shortDescription: string;
  fullDescription?: string | null;
  icon: string;
  accentColor?: string | null;
  orderIdx: number;
  visible: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverMediaId?: string | null;
};

export async function updateService(serviceId: string, input: ServiceInput) {
  const me = await requireAdmin();
  try {
    await db
      .update(schema.services)
      .set({
        title: input.title,
        shortTitle: input.shortTitle,
        shortDescription: input.shortDescription,
        fullDescription: input.fullDescription || null,
        icon: input.icon,
        accentColor: input.accentColor || null,
        orderIdx: input.orderIdx,
        visible: input.visible,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        coverMediaId: input.coverMediaId || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.services.id, serviceId));
    await logAudit({
      userId: me.id,
      entity: "services",
      entityId: serviceId,
      action: "update",
      diff: { title: input.title, visible: input.visible },
    });
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${serviceId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── Sub-services ─────────── */

export async function addSubService(serviceId: string) {
  await requireAdmin();
  const existing = await db
    .select({ idx: schema.subServices.orderIdx })
    .from(schema.subServices)
    .where(eq(schema.subServices.serviceId, serviceId));
  const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
  await db.insert(schema.subServices).values({
    id: id(),
    serviceId,
    title: "Nouveau sous-service",
    description: "Description...",
    orderIdx: maxIdx + 1,
  });
  revalidatePath(`/admin/services/${serviceId}`);
  return { ok: true as const };
}

export async function updateSubService(subId: string, input: { title: string; description: string }) {
  await requireAdmin();
  try {
    await db
      .update(schema.subServices)
      .set({ title: input.title, description: input.description })
      .where(eq(schema.subServices.id, subId));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteSubService(subId: string, serviceId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.subServices).where(eq(schema.subServices.id, subId));
    revalidatePath(`/admin/services/${serviceId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── FAQs ─────────── */

export async function addFaq(serviceId: string) {
  await requireAdmin();
  const existing = await db
    .select({ idx: schema.serviceFaqs.orderIdx })
    .from(schema.serviceFaqs)
    .where(eq(schema.serviceFaqs.serviceId, serviceId));
  const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
  await db.insert(schema.serviceFaqs).values({
    id: id(),
    serviceId,
    question: "Nouvelle question ?",
    answer: "Reponse...",
    orderIdx: maxIdx + 1,
    scope: "service",
  });
  revalidatePath(`/admin/services/${serviceId}`);
  return { ok: true as const };
}

export async function updateFaq(faqId: string, input: { question: string; answer: string }) {
  await requireAdmin();
  try {
    await db
      .update(schema.serviceFaqs)
      .set({ question: input.question, answer: input.answer })
      .where(eq(schema.serviceFaqs.id, faqId));
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteFaq(faqId: string, serviceId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.serviceFaqs).where(eq(schema.serviceFaqs.id, faqId));
    revalidatePath(`/admin/services/${serviceId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
