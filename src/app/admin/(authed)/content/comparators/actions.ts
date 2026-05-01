"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { z } from "zod";

const comparatorSchema = z.object({
  slug: z.string().max(120).optional(),
  title: z.string().min(1).max(280),
  optionAName: z.string().min(1).max(120),
  optionBName: z.string().min(1).max(120),
  tagline: z.string().min(1).max(280),
  intro: z.string().min(1).max(8000),
  verdict: z.string().min(1).max(8000),
  category: z.string().min(1).max(60),
  accent: z.string().min(1).max(40),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(400).optional(),
  visible: z.boolean().optional(),
  orderIdx: z.number().int().optional(),
});

export type ComparatorInput = z.infer<typeof comparatorSchema>;

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "comparatif";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.comparators.id }).from(schema.comparators).where(eq(schema.comparators.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

function nullify(v: string | undefined | null): string | null {
  return v && v.trim().length > 0 ? v : null;
}

export async function createComparator(input: ComparatorInput) {
  await requireAdmin();
  try {
    const p = comparatorSchema.parse(input);
    const newId = id();
    const slug = await uniqueSlug(p.slug || p.title);
    await db.insert(schema.comparators).values({
      id: newId,
      slug,
      title: p.title,
      optionAName: p.optionAName,
      optionBName: p.optionBName,
      tagline: p.tagline,
      intro: p.intro,
      verdict: p.verdict,
      category: p.category,
      accent: p.accent,
      seoTitle: nullify(p.seoTitle),
      seoDescription: nullify(p.seoDescription),
      visible: p.visible ?? true,
      orderIdx: p.orderIdx ?? 0,
    });
    revalidatePath("/admin/content/comparators");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateComparator(comparatorId: string, input: ComparatorInput) {
  await requireAdmin();
  try {
    const p = comparatorSchema.parse(input);
    const slug = await uniqueSlug(p.slug || p.title, comparatorId);
    await db
      .update(schema.comparators)
      .set({
        slug,
        title: p.title,
        optionAName: p.optionAName,
        optionBName: p.optionBName,
        tagline: p.tagline,
        intro: p.intro,
        verdict: p.verdict,
        category: p.category,
        accent: p.accent,
        seoTitle: nullify(p.seoTitle),
        seoDescription: nullify(p.seoDescription),
        visible: p.visible ?? true,
        orderIdx: p.orderIdx ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.comparators.id, comparatorId));
    revalidatePath("/admin/content/comparators");
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteComparator(comparatorId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.comparators).where(eq(schema.comparators.id, comparatorId));
    revalidatePath("/admin/content/comparators");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── Comparator rows (criteria) ─────────── */

export async function addComparatorRow(comparatorId: string) {
  await requireAdmin();
  try {
    const existing = await db.select({ idx: schema.comparatorRows.orderIdx }).from(schema.comparatorRows).where(eq(schema.comparatorRows.comparatorId, comparatorId));
    const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
    await db.insert(schema.comparatorRows).values({
      id: id(),
      comparatorId,
      criterion: "Nouveau critere",
      optionA: "...",
      optionB: "...",
      winner: "tie",
      orderIdx: maxIdx + 1,
    });
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateComparatorRow(rowId: string, comparatorId: string, input: { criterion: string; optionA: string; optionB: string; winner: "A" | "B" | "tie" }) {
  await requireAdmin();
  try {
    await db.update(schema.comparatorRows).set(input).where(eq(schema.comparatorRows.id, rowId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteComparatorRow(rowId: string, comparatorId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.comparatorRows).where(eq(schema.comparatorRows.id, rowId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── Use cases ─────────── */

export async function addComparatorUseCase(comparatorId: string) {
  await requireAdmin();
  try {
    const existing = await db.select({ idx: schema.comparatorUseCases.orderIdx }).from(schema.comparatorUseCases).where(eq(schema.comparatorUseCases.comparatorId, comparatorId));
    const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
    await db.insert(schema.comparatorUseCases).values({
      id: id(),
      comparatorId,
      scenario: "Nouveau scenario",
      recommendation: "A",
      reason: "Raison...",
      orderIdx: maxIdx + 1,
    });
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateComparatorUseCase(useCaseId: string, comparatorId: string, input: { scenario: string; recommendation: "A" | "B"; reason: string }) {
  await requireAdmin();
  try {
    await db.update(schema.comparatorUseCases).set(input).where(eq(schema.comparatorUseCases.id, useCaseId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteComparatorUseCase(useCaseId: string, comparatorId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.comparatorUseCases).where(eq(schema.comparatorUseCases.id, useCaseId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── FAQs ─────────── */

export async function addComparatorFaq(comparatorId: string) {
  await requireAdmin();
  try {
    const existing = await db.select({ idx: schema.comparatorFaqs.orderIdx }).from(schema.comparatorFaqs).where(eq(schema.comparatorFaqs.comparatorId, comparatorId));
    const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
    await db.insert(schema.comparatorFaqs).values({
      id: id(),
      comparatorId,
      question: "Nouvelle question ?",
      answer: "Reponse...",
      orderIdx: maxIdx + 1,
    });
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateComparatorFaq(faqId: string, comparatorId: string, input: { question: string; answer: string }) {
  await requireAdmin();
  try {
    await db.update(schema.comparatorFaqs).set(input).where(eq(schema.comparatorFaqs.id, faqId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteComparatorFaq(faqId: string, comparatorId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.comparatorFaqs).where(eq(schema.comparatorFaqs.id, faqId));
    revalidatePath(`/admin/content/comparators/${comparatorId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
