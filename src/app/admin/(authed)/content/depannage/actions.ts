"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { z } from "zod";

const depannageSchema = z.object({
  slug: z.string().optional(),
  label: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  businessImpact: z.string().min(1),
  accentColor: z.string().min(1),
  brands: z.string().optional(),
  failuresJson: z.string().optional(),
  partsInStock: z.string().optional(),
  relatedServices: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
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
  await requireAdmin();
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
    revalidatePath("/admin/content/depannage");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateDepannageService(serviceId: string, input: DepannageInput) {
  await requireAdmin();
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
    revalidatePath("/admin/content/depannage");
    revalidatePath(`/admin/content/depannage/${serviceId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteDepannageService(serviceId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.depannageServices).where(eq(schema.depannageServices.id, serviceId));
    revalidatePath("/admin/content/depannage");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
