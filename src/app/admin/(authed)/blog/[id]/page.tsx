import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BlogForm } from "../BlogForm";

function isoLocal(d: Date | null | undefined): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const post = rows[0];

  return (
    <>
      <Topbar
        title={post.title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Blog", href: "/admin/blog" },
          { label: post.title },
        ]}
      />
      <div className="p-8">
        <BlogForm
          postId={post.id}
          initial={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            category: post.category,
            status: post.status,
            publishedAt: isoLocal(post.publishedAt),
            readingMinutes: String(post.readingMinutes),
            tags: post.tags || "",
            seoTitle: post.seoTitle || "",
            seoDescription: post.seoDescription || "",
            coverMediaId: post.coverMediaId || "",
            content: post.content || "",
            contentHtml: post.contentHtml || "",
          }}
        />
      </div>
    </>
  );
}
