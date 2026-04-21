"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";

type Input = {
  title: string;
  slug?: string;
  category: string;
  clientName?: string | null;
  location?: string | null;
  year?: number | null;
  description?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  highlight?: string | null;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  coverMediaId?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "realisation";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.projects.id }).from(schema.projects).where(eq(schema.projects.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

export async function createProject(input: Input) {
  await requireAdmin();
  try {
    const newId = id();
    const slug = await uniqueSlug(input.slug || input.title);
    await db.insert(schema.projects).values({
      id: newId,
      slug,
      title: input.title,
      category: input.category,
      clientName: input.clientName || null,
      location: input.location || null,
      year: input.year ?? null,
      description: input.description || null,
      challenge: input.challenge || null,
      solution: input.solution || null,
      result: input.result || null,
      highlight: input.highlight || null,
      status: input.status,
      featured: !!input.featured,
      coverMediaId: input.coverMediaId || null,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
    });
    revalidatePath("/admin/projects");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateProject(projectId: string, input: Input) {
  await requireAdmin();
  try {
    const slug = await uniqueSlug(input.slug || input.title, projectId);
    await db
      .update(schema.projects)
      .set({
        slug,
        title: input.title,
        category: input.category,
        clientName: input.clientName || null,
        location: input.location || null,
        year: input.year ?? null,
        description: input.description || null,
        challenge: input.challenge || null,
        solution: input.solution || null,
        result: input.result || null,
        highlight: input.highlight || null,
        status: input.status,
        featured: !!input.featured,
        coverMediaId: input.coverMediaId || null,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, projectId));
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteProject(projectId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.projects).where(eq(schema.projects.id, projectId));
    revalidatePath("/admin/projects");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function duplicateProject(projectId: string) {
  await requireAdmin();
  try {
    const rows = await db.select().from(schema.projects).where(eq(schema.projects.id, projectId)).limit(1);
    if (rows.length === 0) return { ok: false as const, error: "Not found" };
    const src = rows[0];
    const newId = id();
    const newSlug = await uniqueSlug(`${src.slug}-copie`);
    await db.insert(schema.projects).values({
      id: newId,
      slug: newSlug,
      title: `${src.title} (copie)`,
      category: src.category,
      clientName: src.clientName,
      location: src.location,
      year: src.year,
      description: src.description,
      challenge: src.challenge,
      solution: src.solution,
      result: src.result,
      highlight: src.highlight,
      status: "draft",
      featured: false,
      coverMediaId: src.coverMediaId,
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
    });
    revalidatePath("/admin/projects");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

