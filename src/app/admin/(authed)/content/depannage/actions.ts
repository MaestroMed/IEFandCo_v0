"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { jsonStringField } from "@/lib/admin/validation";
import { z } from "zod";

const depannageSchema = z.object({
  slug: z.string().max(120).optional(),
  label: z.string().min(1).max(120),
  tagline: z.string().min(1).max(280),
  intro: z.string().min(1).max(8000),
  businessImpact: z.string().min(1).max(2000),
  accentColor: z.string().min(1).max(40),
  brands: z.string().max(2000).optional(),
  failuresJson: jsonStringField({ max: 30000 }),
  partsInStock: z.string().max(4000).optional(),
  relatedServices: z.string().max(400).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
  visible: z.boolean().optional(),
  orderIdx: z.number().int().optional(),
});

export type DepannageInput = z.infer<typeof depannageSchema>;

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "depannage";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.depannageServices.id }).from(schema.depannageServices).where(eq(schema.depannageServices.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

function nullify(v: string | undefined | null): string | null {
  return v && v.trim().length > 0 ? v : null;
}

export async function createDepannageService(input: DepannageInput) {
  const me = await requireAdmin();
  try {
    const p = depannageSchema.parse(input);
    const newId = id();
    const slug = await uniqueSlug(p.slug || p.label);
    await db.insert(schema.depannageServices).values({
      id: newId,
      slug,
      label: p.label,
      tagline: p.tagline,
      intro: p.intro,
      businessImpact: p.businessImpact,
      accentColor: p.accentColor,
      brands: nullify(p.brands),
      failuresJson: nullify(p.failuresJson),
      partsInStock: nullify(p.partsInStock),
      relatedServices: nullify(p.relatedServices),
      seoTitle: nullify(p.seoTitle),
      seoDescription: nullify(p.seoDescription),
      visible: p.visible ?? true,
      orderIdx: p.orderIdx ?? 0,
    });
    await logAudit({
      userId: me.id,
      entity: "content:depannage",
      entityId: newId,
      action: "create",
      diff: { label: p.label, slug },
    });
    revalidatePath("/admin/content/depannage");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateDepannageService(serviceId: string, input: DepannageInput) {
  const me = await requireAdmin();
  try {
    const p = depannageSchema.parse(input);
    const slug = await uniqueSlug(p.slug || p.label, serviceId);
    await db
      .update(schema.depannageServices)
      .set({
        slug,
        label: p.label,
        tagline: p.tagline,
        intro: p.intro,
        businessImpact: p.businessImpact,
        accentColor: p.accentColor,
        brands: nullify(p.brands),
        failuresJson: nullify(p.failuresJson),
        partsInStock: nullify(p.partsInStock),
        relatedServices: nullify(p.relatedServices),
        seoTitle: nullify(p.seoTitle),
        seoDescription: nullify(p.seoDescription),
        visible: p.visible ?? true,
        orderIdx: p.orderIdx ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.depannageServices.id, serviceId));
    await logAudit({
      userId: me.id,
      entity: "content:depannage",
      entityId: serviceId,
      action: "update",
      diff: { label: p.label },
    });
    revalidatePath("/admin/content/depannage");
    revalidatePath(`/admin/content/depannage/${serviceId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteDepannageService(serviceId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.depannageServices).where(eq(schema.depannageServices.id, serviceId));
    await logAudit({
      userId: me.id,
      entity: "content:depannage",
      entityId: serviceId,
      action: "delete",
    });
    revalidatePath("/admin/content/depannage");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
