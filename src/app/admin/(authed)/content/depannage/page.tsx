import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Zap, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function DepannageListPage() {
  const rows = await db.select().from(schema.depannageServices).orderBy(asc(schema.depannageServices.orderIdx));

  return (
    <>
      <Topbar
        title="Services depannage"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenu SEO" },
          { label: "Depannage" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{rows.length} service{rows.length > 1 ? "s" : ""}</p>
          <Link href="/admin/content/depannage/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Nouveau service
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={Zap} title="Aucun service" description="Ajoutez vos services de depannage urgence pour activer /depannage/[service]/[zone]." actionLabel="Creer un service" actionHref="/admin/content/depannage/new" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((s) => (
              <Link key={s.id} href={`/admin/content/depannage/${s.id}`} className="rounded-xl p-5 transition-all hover:-translate-y-0.5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{s.label}</h3>
                  {!s.visible && <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>masque</span>}
                </div>
                <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{s.tagline}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span>/{s.slug}</span>
                  {s.brands && <span className="truncate ml-2 max-w-[60%]">{s.brands}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
