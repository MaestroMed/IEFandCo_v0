import { db, schema } from "@/db";
import { count, desc, eq, inArray, or, isNull } from "drizzle-orm";
import { STATIC_PAGES } from "./constants";

export async function getSeoOverview() {
  const [
    servicesCount,
    blogPublishedCount,
    projectsPublishedCount,
    redirectsCount,
    servicesMissingDesc,
    blogMissingDesc,
    projectsMissingDesc,
  ] = await Promise.all([
    db.select({ c: count() }).from(schema.services),
    db.select({ c: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.status, "published")),
    db.select({ c: count() }).from(schema.projects).where(eq(schema.projects.status, "published")),
    db.select({ c: count() }).from(schema.redirects),
    db.select({ c: count() }).from(schema.services).where(or(isNull(schema.services.seoDescription), eq(schema.services.seoDescription, ""))),
    db.select({ c: count() }).from(schema.blogPosts).where(or(isNull(schema.blogPosts.seoDescription), eq(schema.blogPosts.seoDescription, ""))),
    db.select({ c: count() }).from(schema.projects).where(or(isNull(schema.projects.seoDescription), eq(schema.projects.seoDescription, ""))),
  ]);

  const totalPages =
    servicesCount[0].c +
    blogPublishedCount[0].c +
    projectsPublishedCount[0].c +
    STATIC_PAGES.length;

  const missingDesc =
    servicesMissingDesc[0].c + blogMissingDesc[0].c + projectsMissingDesc[0].c;

  return {
    totalPages,
    missingDesc,
    redirectsCount: redirectsCount[0].c,
    schemaCount: 8,
  };
}

export interface MetaRow {
  source: "service" | "blog" | "project" | "static";
  id: string;
  name: string;
  path: string;
  title: string | null;
  description: string | null;
  editHref: string;
}

export async function getMetaMatrix(): Promise<MetaRow[]> {
  const [services, posts, projects, overrides] = await Promise.all([
    db
      .select({
        id: schema.services.id,
        slug: schema.services.slug,
        title: schema.services.title,
        seoTitle: schema.services.seoTitle,
        seoDescription: schema.services.seoDescription,
      })
      .from(schema.services),
    db
      .select({
        id: schema.blogPosts.id,
        slug: schema.blogPosts.slug,
        title: schema.blogPosts.title,
        seoTitle: schema.blogPosts.seoTitle,
        seoDescription: schema.blogPosts.seoDescription,
      })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.status, "published")),
    db
      .select({
        id: schema.projects.id,
        slug: schema.projects.slug,
        title: schema.projects.title,
        seoTitle: schema.projects.seoTitle,
        seoDescription: schema.projects.seoDescription,
      })
      .from(schema.projects)
      .where(eq(schema.projects.status, "published")),
    db
      .select()
      .from(schema.settings)
      .where(
        inArray(
          schema.settings.key,
          STATIC_PAGES.map((p) => `seo:${p.key}`),
        ),
      ),
  ]);

  const overrideMap: Record<string, { title?: string; description?: string }> = {};
  for (const o of overrides) {
    try {
      overrideMap[o.key] = JSON.parse(o.valueJson);
    } catch {
      overrideMap[o.key] = {};
    }
  }

  const rows: MetaRow[] = [];

  for (const p of STATIC_PAGES) {
    const ov = overrideMap[`seo:${p.key}`] || {};
    rows.push({
      source: "static",
      id: p.key,
      name: p.name,
      path: p.path,
      title: ov.title || null,
      description: ov.description || null,
      editHref: `/admin/seo/meta/${p.key}`,
    });
  }

  for (const s of services) {
    rows.push({
      source: "service",
      id: s.id,
      name: s.title,
      path: `/services/${s.slug}`,
      title: s.seoTitle,
      description: s.seoDescription,
      editHref: `/admin/services/${s.id}`,
    });
  }

  for (const p of posts) {
    rows.push({
      source: "blog",
      id: p.id,
      name: p.title,
      path: `/blog/${p.slug}`,
      title: p.seoTitle,
      description: p.seoDescription,
      editHref: `/admin/blog/${p.id}`,
    });
  }

  for (const p of projects) {
    rows.push({
      source: "project",
      id: p.id,
      name: p.title,
      path: `/realisations/${p.slug}`,
      title: p.seoTitle,
      description: p.seoDescription,
      editHref: `/admin/projects/${p.id}`,
    });
  }

  return rows;
}

export async function getRedirects() {
  return db.select().from(schema.redirects).orderBy(desc(schema.redirects.createdAt));
}
