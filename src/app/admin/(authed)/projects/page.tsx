import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { ProjectsTable } from "./ProjectsTable";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      slug: schema.projects.slug,
      category: schema.projects.category,
      clientName: schema.projects.clientName,
      year: schema.projects.year,
      status: schema.projects.status,
      updatedAt: schema.projects.updatedAt,
      coverUrl: schema.media.url,
    })
    .from(schema.projects)
    .leftJoin(schema.media, eq(schema.media.id, schema.projects.coverMediaId))
    .orderBy(desc(schema.projects.updatedAt));

  return (
    <>
      <Topbar title="Realisations" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Realisations" }]} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} projet{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="Aucune realisation"
            description="Commencez par creer votre premiere realisation pour la vitrine."
            actionLabel="Creer une realisation"
            actionHref="/admin/projects/new"
          />
        ) : (
          <ProjectsTable rows={rows} />
        )}
      </div>
    </>
  );
}
