import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function ZonesListPage() {
  const rows = await db.select().from(schema.zones).orderBy(asc(schema.zones.orderIdx));

  return (
    <>
      <Topbar
        title="Zones d'intervention"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenu SEO" },
          { label: "Zones" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{rows.length} zone{rows.length > 1 ? "s" : ""}</p>
          <Link href="/admin/content/zones/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Nouvelle zone
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucune zone"
            description="Ajoutez vos zones d'intervention pour activer les pages /zones/[slug]."
            actionLabel="Creer une zone"
            actionHref="/admin/content/zones/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((z) => (
              <Link
                key={z.id}
                href={`/admin/content/zones/${z.id}`}
                className="rounded-xl p-5 transition-all hover:-translate-y-0.5"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--color-copper)" }}>
                    {z.code} · {z.region}
                  </span>
                  {!z.visible && (
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      masque
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{z.name}</h3>
                <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{z.tagline}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span>/{z.slug}</span>
                  <span>SLA {z.slaUrgence}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
