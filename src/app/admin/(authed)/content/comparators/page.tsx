import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Scale, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function ComparatorsListPage() {
  const rows = await db.select().from(schema.comparators).orderBy(asc(schema.comparators.orderIdx));

  return (
    <>
      <Topbar
        title="Comparatifs"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenu SEO" },
          { label: "Comparatifs" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{rows.length} comparatif{rows.length > 1 ? "s" : ""}</p>
          <Link href="/admin/content/comparators/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Nouveau comparatif
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={Scale} title="Aucun comparatif" description="Creez vos pages X vs Y pour acquerir du trafic SEO." actionLabel="Creer un comparatif" actionHref="/admin/content/comparators/new" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((c) => (
              <Link key={c.id} href={`/admin/content/comparators/${c.id}`} className="rounded-xl p-5 transition-all hover:-translate-y-0.5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--color-copper)" }}>{c.category}</span>
                  {!c.visible && <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>masque</span>}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{c.title}</h3>
                <p className="mt-1 text-xs font-mono" style={{ color: "var(--text-muted)" }}>{c.optionAName} vs {c.optionBName}</p>
                <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{c.tagline}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span>/{c.slug}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
