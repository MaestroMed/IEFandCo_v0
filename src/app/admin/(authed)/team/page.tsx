import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { TeamCards } from "./TeamCards";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const rows = await db.select().from(schema.teamMembers).orderBy(asc(schema.teamMembers.orderIdx));

  return (
    <>
      <Topbar title="Equipe" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Equipe" }]} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} membre{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter un membre
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={Users} title="Aucun membre" description="Ajoutez les profils de votre equipe." actionLabel="Ajouter un membre" actionHref="/admin/team/new" />
        ) : (
          <TeamCards rows={rows} />
        )}
      </div>
    </>
  );
}
