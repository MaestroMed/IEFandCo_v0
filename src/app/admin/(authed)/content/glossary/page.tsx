import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function GlossaryListPage() {
  const rows = await db.select().from(schema.glossaryTerms).orderBy(asc(schema.glossaryTerms.term));

  return (
    <>
      <Topbar
        title="Glossaire"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenu SEO" },
          { label: "Glossaire" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} terme{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/content/glossary/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Nouveau terme
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aucun terme"
            description="Ajoutez votre premier terme pour le glossaire."
            actionLabel="Ajouter un terme"
            actionHref="/admin/content/glossary/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ background: "var(--bg-muted)" }}>
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Terme</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Slug</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Categorie</th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Visible</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/content/glossary/${r.id}`} className="font-medium hover:text-primary" style={{ color: "var(--text)" }}>
                        {r.term}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{r.slug}</td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{r.category}</td>
                    <td className="px-4 py-3 text-center">
                      {r.visible ? <span style={{ color: "rgb(34,197,94)" }}>oui</span> : <span style={{ color: "var(--text-muted)" }}>non</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
