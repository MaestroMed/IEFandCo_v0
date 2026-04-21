import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { BlogTable } from "./BlogTable";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const rows = await db
    .select({
      id: schema.blogPosts.id,
      title: schema.blogPosts.title,
      slug: schema.blogPosts.slug,
      category: schema.blogPosts.category,
      status: schema.blogPosts.status,
      publishedAt: schema.blogPosts.publishedAt,
      updatedAt: schema.blogPosts.updatedAt,
      coverUrl: schema.media.url,
    })
    .from(schema.blogPosts)
    .leftJoin(schema.media, eq(schema.media.id, schema.blogPosts.coverMediaId))
    .orderBy(desc(schema.blogPosts.updatedAt));

  return (
    <>
      <Topbar title="Blog" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Blog" }]} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} article{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Aucun article"
            description="Commencez par publier votre premier article technique ou guide."
            actionLabel="Rediger un article"
            actionHref="/admin/blog/new"
          />
        ) : (
          <BlogTable rows={rows} />
        )}
      </div>
    </>
  );
}
