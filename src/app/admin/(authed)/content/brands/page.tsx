import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Award, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function BrandsListPage() {
  const rows = await db.select().from(schema.maintenanceBrands).orderBy(asc(schema.maintenanceBrands.orderIdx));

  return (
    <>
      <Topbar
        title="Marques (maintenance)"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenu SEO" },
          { label: "Marques" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{rows.length} marque{rows.length > 1 ? "s" : ""}</p>
          <Link href="/admin/content/brands/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Nouvelle marque
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={Award} title="Aucune marque" description="Ajoutez les marques que vous depannez (Hormann, Crawford...)" actionLabel="Ajouter une marque" actionHref="/admin/content/brands/new" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((b) => (
              <Link key={b.id} href={`/admin/content/brands/${b.id}`} className="rounded-xl p-5 transition-all hover:-translate-y-0.5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{b.name}</h3>
                  {!b.visible && <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>masque</span>}
                </div>
                <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{b.tagline}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span>/{b.slug}</span>
                  {b.searchVolume && <span>{b.searchVolume}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
