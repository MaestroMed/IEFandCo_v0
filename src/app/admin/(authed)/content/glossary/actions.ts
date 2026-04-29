"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { z } from "zod";

export const GLOSSARY_CATEGORIES = ["Norme", "Technique", "Composant", "Réglementation", "Méthode", "Sécurité"] as const;

const glossarySchema = z.object({
  slug: z.string().optional(),
  term: z.string().min(2),
  category: z.enum(GLOSSARY_CATEGORIES),
  shortDef: z.string().min(1),
  fullDef: z.string().min(1),
  relatedSlugs: z.string().optional(),
  relatedServices: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.number().int().optional(),
});

export type GlossaryInput = z.infer<typeof glossarySchema>;

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "terme";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.glossaryTerms.id }).from(schema.glossaryTerms).where(eq(schema.glossaryTerms.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

export async function createGlossaryTerm(input: GlossaryInput) {
  await requireAdmin();
  try {
    const parsed = glossarySchema.parse(input);
    const newId = id();
    const slug = await uniqueSlug(parsed.slug || parsed.term);
    await db.insert(schema.glossaryTerms).values({
      id: newId,
      slug,
      term: parsed.term,
      category: parsed.category,
      shortDef: parsed.shortDef,
      fullDef: parsed.fullDef,
      relatedSlugs: parsed.relatedSlugs || null,
      relatedServices: parsed.relatedServices || null,
      visible: parsed.visible ?? true,
      orderIdx: parsed.orderIdx ?? 0,
    });
    revalidatePath("/admin/content/glossary");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateGlossaryTerm(termId: string, input: GlossaryInput) {
  await requireAdmin();
  try {
    const parsed = glossarySchema.parse(input);
    const slug = await uniqueSlug(parsed.slug || parsed.term, termId);
    await db
      .update(schema.glossaryTerms)
      .set({
        slug,
        term: parsed.term,
        category: parsed.category,
        shortDef: parsed.shortDef,
        fullDef: parsed.fullDef,
        relatedSlugs: parsed.relatedSlugs || null,
        relatedServices: parsed.relatedServices || null,
        visible: parsed.visible ?? true,
        orderIdx: parsed.orderIdx ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.glossaryTerms.id, termId));
    revalidatePath("/admin/content/glossary");
    revalidatePath(`/admin/content/glossary/${termId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteGlossaryTerm(termId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.glossaryTerms).where(eq(schema.glossaryTerms.id, termId));
    revalidatePath("/admin/content/glossary");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
