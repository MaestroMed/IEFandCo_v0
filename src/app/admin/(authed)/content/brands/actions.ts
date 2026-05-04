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

const brandSchema = z.object({
  slug: z.string().max(120).optional(),
  name: z.string().min(1).max(120),
  tagline: z.string().min(1).max(280),
  intro: z.string().min(1).max(8000),
  productsJson: jsonStringField({ max: 30000 }),
  failuresJson: jsonStringField({ max: 30000 }),
  strengthsJson: jsonStringField({ max: 10000 }),
  faqJson: jsonStringField({ max: 30000 }),
  searchVolume: z.string().max(80).optional(),
  accentColor: z.string().max(40).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
  logoMediaId: z.string().max(64).optional(),
  coverMediaId: z.string().max(64).optional(),
  visible: z.boolean().optional(),
  orderIdx: z.number().int().optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "marque";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.maintenanceBrands.id }).from(schema.maintenanceBrands).where(eq(schema.maintenanceBrands.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

function nullify(v: string | undefined | null): string | null {
  return v && v.trim().length > 0 ? v : null;
}

export async function createBrand(input: BrandInput) {
  const me = await requireAdmin();
  try {
    const p = brandSchema.parse(input);
    const newId = id();
    const slug = await uniqueSlug(p.slug || p.name);
    await db.insert(schema.maintenanceBrands).values({
      id: newId,
      slug,
      name: p.name,
      tagline: p.tagline,
      intro: p.intro,
      productsJson: nullify(p.productsJson),
      failuresJson: nullify(p.failuresJson),
      strengthsJson: nullify(p.strengthsJson),
      faqJson: nullify(p.faqJson),
      searchVolume: nullify(p.searchVolume),
      accentColor: nullify(p.accentColor),
      seoTitle: nullify(p.seoTitle),
      seoDescription: nullify(p.seoDescription),
      logoMediaId: nullify(p.logoMediaId),
      coverMediaId: nullify(p.coverMediaId),
      visible: p.visible ?? true,
      orderIdx: p.orderIdx ?? 0,
    });
    await logAudit({
      userId: me.id,
      entity: "content:brands",
      entityId: newId,
      action: "create",
      diff: { name: p.name, slug },
    });
    revalidatePath("/admin/content/brands");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateBrand(brandId: string, input: BrandInput) {
  const me = await requireAdmin();
  try {
    const p = brandSchema.parse(input);
    const slug = await uniqueSlug(p.slug || p.name, brandId);
    await db
      .update(schema.maintenanceBrands)
      .set({
        slug,
        name: p.name,
        tagline: p.tagline,
        intro: p.intro,
        productsJson: nullify(p.productsJson),
        failuresJson: nullify(p.failuresJson),
        strengthsJson: nullify(p.strengthsJson),
        faqJson: nullify(p.faqJson),
        searchVolume: nullify(p.searchVolume),
        accentColor: nullify(p.accentColor),
        seoTitle: nullify(p.seoTitle),
        seoDescription: nullify(p.seoDescription),
        logoMediaId: nullify(p.logoMediaId),
        coverMediaId: nullify(p.coverMediaId),
        visible: p.visible ?? true,
        orderIdx: p.orderIdx ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.maintenanceBrands.id, brandId));
    await logAudit({
      userId: me.id,
      entity: "content:brands",
      entityId: brandId,
      action: "update",
      diff: { name: p.name },
    });
    revalidatePath("/admin/content/brands");
    revalidatePath(`/admin/content/brands/${brandId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteBrand(brandId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.maintenanceBrands).where(eq(schema.maintenanceBrands.id, brandId));
    await logAudit({
      userId: me.id,
      entity: "content:brands",
      entityId: brandId,
      action: "delete",
    });
    revalidatePath("/admin/content/brands");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
