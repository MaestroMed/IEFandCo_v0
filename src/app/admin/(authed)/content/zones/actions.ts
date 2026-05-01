"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { jsonStringField } from "@/lib/admin/validation";
import { z } from "zod";

const zoneSchema = z.object({
  slug: z.string().max(120).optional(),
  name: z.string().min(1).max(120),
  code: z.string().min(1).max(8),
  region: z.string().min(1).max(120),
  tagline: z.string().min(1).max(280),
  intro: z.string().min(1).max(8000),
  cities: z.string().max(2000).optional(),
  slaUrgence: z.string().min(1).max(80),
  slaStandard: z.string().min(1).max(80),
  hubs: z.string().max(2000).optional(),
  kpisJson: jsonStringField(),
  testimonialJson: jsonStringField({ max: 4000 }),
  faqJson: jsonStringField({ max: 30000 }),
  centerLat: z.string().max(20).optional(),
  centerLng: z.string().max(20).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
  coverMediaId: z.string().max(64).optional(),
  visible: z.boolean().optional(),
  orderIdx: z.number().int().optional(),
});

export type ZoneInput = z.infer<typeof zoneSchema>;

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "zone";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.zones.id }).from(schema.zones).where(eq(schema.zones.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

function nullify(v: string | undefined | null): string | null {
  return v && v.trim().length > 0 ? v : null;
}

export async function createZone(input: ZoneInput) {
  await requireAdmin();
  try {
    const p = zoneSchema.parse(input);
    const newId = id();
    const slug = await uniqueSlug(p.slug || p.name);
    await db.insert(schema.zones).values({
      id: newId,
      slug,
      name: p.name,
      code: p.code,
      region: p.region,
      tagline: p.tagline,
      intro: p.intro,
      cities: nullify(p.cities),
      slaUrgence: p.slaUrgence,
      slaStandard: p.slaStandard,
      hubs: nullify(p.hubs),
      kpisJson: nullify(p.kpisJson),
      testimonialJson: nullify(p.testimonialJson),
      faqJson: nullify(p.faqJson),
      centerLat: nullify(p.centerLat),
      centerLng: nullify(p.centerLng),
      seoTitle: nullify(p.seoTitle),
      seoDescription: nullify(p.seoDescription),
      coverMediaId: nullify(p.coverMediaId),
      visible: p.visible ?? true,
      orderIdx: p.orderIdx ?? 0,
    });
    revalidatePath("/admin/content/zones");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateZone(zoneId: string, input: ZoneInput) {
  await requireAdmin();
  try {
    const p = zoneSchema.parse(input);
    const slug = await uniqueSlug(p.slug || p.name, zoneId);
    await db
      .update(schema.zones)
      .set({
        slug,
        name: p.name,
        code: p.code,
        region: p.region,
        tagline: p.tagline,
        intro: p.intro,
        cities: nullify(p.cities),
        slaUrgence: p.slaUrgence,
        slaStandard: p.slaStandard,
        hubs: nullify(p.hubs),
        kpisJson: nullify(p.kpisJson),
        testimonialJson: nullify(p.testimonialJson),
        faqJson: nullify(p.faqJson),
        centerLat: nullify(p.centerLat),
        centerLng: nullify(p.centerLng),
        seoTitle: nullify(p.seoTitle),
        seoDescription: nullify(p.seoDescription),
        coverMediaId: nullify(p.coverMediaId),
        visible: p.visible ?? true,
        orderIdx: p.orderIdx ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.zones.id, zoneId));
    revalidatePath("/admin/content/zones");
    revalidatePath(`/admin/content/zones/${zoneId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteZone(zoneId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.zones).where(eq(schema.zones.id, zoneId));
    revalidatePath("/admin/content/zones");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
