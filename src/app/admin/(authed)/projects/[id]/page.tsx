import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProjectForm } from "../ProjectForm";
import { ProjectGallery } from "../ProjectGallery";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const project = rows[0];

  const gallery = await db
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
    .where(eq(schema.projectImages.projectId, id))
    .orderBy(asc(schema.projectImages.orderIdx));

  return (
    <>
      <Topbar
        title={project.title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Realisations", href: "/admin/projects" },
          { label: project.title },
        ]}
      />
      <div className="p-8 space-y-6">
        <ProjectForm
          projectId={project.id}
          initial={{
            title: project.title,
            slug: project.slug,
            category: project.category,
            clientName: project.clientName || "",
            location: project.location || "",
            year: project.year ? String(project.year) : "",
            description: project.description || "",
            challenge: project.challenge || "",
            solution: project.solution || "",
            result: project.result || "",
            highlight: project.highlight || "",
            status: project.status,
            featured: project.featured,
            coverMediaId: project.coverMediaId || "",
            seoTitle: project.seoTitle || "",
            seoDescription: project.seoDescription || "",
          }}
        />
        <ProjectGallery projectId={project.id} rows={gallery} />
      </div>
    </>
  );
}
