"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { asc, eq } from "drizzle-orm";
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
  const me = await requireAdmin();
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
    await logAudit({
      userId: me.id,
      entity: "projects",
      entityId: newId,
      action: "create",
      diff: { title: input.title, slug, status: input.status },
    });
    revalidatePath("/admin/projects");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateProject(projectId: string, input: Input) {
  const me = await requireAdmin();
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
    await logAudit({
      userId: me.id,
      entity: "projects",
      entityId: projectId,
      action: "update",
      diff: { title: input.title, status: input.status },
    });
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteProject(projectId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.projects).where(eq(schema.projects.id, projectId));
    await logAudit({
      userId: me.id,
      entity: "projects",
      entityId: projectId,
      action: "delete",
    });
    revalidatePath("/admin/projects");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ─────────── Project gallery (project_images) ─────────── */

export async function addProjectImage(projectId: string, mediaId: string, caption?: string | null) {
  await requireAdmin();
  try {
    const existing = await db
      .select({ idx: schema.projectImages.orderIdx })
      .from(schema.projectImages)
      .where(eq(schema.projectImages.projectId, projectId));
    const maxIdx = existing.reduce((acc, r) => Math.max(acc, r.idx), -1);
    const newId = id();
    await db.insert(schema.projectImages).values({
      id: newId,
      projectId,
      mediaId,
      caption: caption || null,
      orderIdx: maxIdx + 1,
    });
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateProjectImage(imageId: string, projectId: string, input: { caption?: string | null; mediaId?: string }) {
  await requireAdmin();
  try {
    const setVals: { caption?: string | null; mediaId?: string } = {};
    if (typeof input.caption !== "undefined") setVals.caption = input.caption || null;
    if (typeof input.mediaId === "string" && input.mediaId) setVals.mediaId = input.mediaId;
    if (Object.keys(setVals).length === 0) return { ok: true as const };
    await db.update(schema.projectImages).set(setVals).where(eq(schema.projectImages.id, imageId));
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteProjectImage(imageId: string, projectId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.projectImages).where(eq(schema.projectImages.id, imageId));
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function reorderProjectImages(projectId: string, ordered: string[]) {
  await requireAdmin();
  try {
    for (let i = 0; i < ordered.length; i++) {
      await db
        .update(schema.projectImages)
        .set({ orderIdx: i })
        .where(eq(schema.projectImages.id, ordered[i]));
    }
    revalidatePath(`/admin/projects/${projectId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function listProjectImages(projectId: string) {
  await requireAdmin();
  return db
    .select({
      id: schema.projectImages.id,
      mediaId: schema.projectImages.mediaId,
      caption: schema.projectImages.caption,
      orderIdx: schema.projectImages.orderIdx,
      url: schema.media.url,
      filename: schema.media.filename,
    })
    .from(schema.projectImages)
    .leftJoin(schema.media, eq(schema.media.id, schema.projectImages.mediaId))
    .where(eq(schema.projectImages.projectId, projectId))
    .orderBy(asc(schema.projectImages.orderIdx));
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

