"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { z } from "zod";

const brandSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  productsJson: z.string().optional(),
  failuresJson: z.string().optional(),
  strengthsJson: z.string().optional(),
  faqJson: z.string().optional(),
  searchVolume: z.string().optional(),
  accentColor: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  logoMediaId: z.string().optional(),
  coverMediaId: z.string().optional(),
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
  await requireAdmin();
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
    revalidatePath("/admin/content/brands");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateBrand(brandId: string, input: BrandInput) {
  await requireAdmin();
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
    revalidatePath("/admin/content/brands");
    revalidatePath(`/admin/content/brands/${brandId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteBrand(brandId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.maintenanceBrands).where(eq(schema.maintenanceBrands.id, brandId));
    revalidatePath("/admin/content/brands");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
