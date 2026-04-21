"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/admin/slug";
import { BLOG_CATEGORIES } from "./constants";

type Input = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string; // JSON string
  contentHtml?: string | null;
  category: (typeof BLOG_CATEGORIES)[number];
  status: "draft" | "scheduled" | "published" | "archived";
  publishedAt?: string | null; // ISO
  readingMinutes?: number;
  tags?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverMediaId?: string | null;
};

function id() {
  return randomBytes(16).toString("hex");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const s = slugify(base) || "article";
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? s : `${s}-${attempt}`;
    const rows = await db.select({ id: schema.blogPosts.id }).from(schema.blogPosts).where(eq(schema.blogPosts.slug, candidate)).limit(1);
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return candidate;
    attempt++;
    if (attempt > 50) return `${s}-${Date.now()}`;
  }
}

export async function createPost(input: Input) {
  await requireAdmin();
  try {
    const newId = id();
    const slug = await uniqueSlug(input.slug || input.title);
    await db.insert(schema.blogPosts).values({
      id: newId,
      slug,
      title: input.title,
      excerpt: input.excerpt || null,
      content: input.content,
      contentHtml: input.contentHtml || null,
      category: input.category,
      status: input.status,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      readingMinutes: input.readingMinutes ?? 5,
      tags: input.tags || null,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      coverMediaId: input.coverMediaId || null,
    });
    revalidatePath("/admin/blog");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updatePost(postId: string, input: Input) {
  await requireAdmin();
  try {
    const slug = await uniqueSlug(input.slug || input.title, postId);
    await db
      .update(schema.blogPosts)
      .set({
        slug,
        title: input.title,
        excerpt: input.excerpt || null,
        content: input.content,
        contentHtml: input.contentHtml || null,
        category: input.category,
        status: input.status,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        readingMinutes: input.readingMinutes ?? 5,
        tags: input.tags || null,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        coverMediaId: input.coverMediaId || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.blogPosts.id, postId));
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${postId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deletePost(postId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, postId));
    revalidatePath("/admin/blog");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function publishNow(postId: string) {
  await requireAdmin();
  try {
    await db
      .update(schema.blogPosts)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.blogPosts.id, postId));
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${postId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
