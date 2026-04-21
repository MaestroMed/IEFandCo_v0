import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Wrench, GripVertical, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  const services = await db.select().from(schema.services).orderBy(asc(schema.services.orderIdx));

  return (
    <>
      <Topbar title="Services" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Services" }]} />

      <div className="p-8 space-y-6">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {services.length} service{services.length > 1 ? "s" : ""}
        </p>

        {services.length === 0 ? (
          <EmptyState icon={Wrench} title="Aucun service" description="Les services sont seedes depuis src/data/services.ts." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/admin/services/${s.id}`}
                className="group relative rounded-xl p-6 transition-all hover:-translate-y-0.5"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                {/* Corner brackets */}
                <span className="pointer-events-none absolute left-2 top-2 h-2 w-2 transition-colors group-hover:border-[var(--color-copper)]" style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }} />
                <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 transition-colors group-hover:border-[var(--color-copper)]" style={{ borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />

                <div className="flex items-start justify-between gap-4">
                  <GripVertical className="h-4 w-4 opacity-30 cursor-grab" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--color-copper)" }}>
                        {s.icon}
                      </span>
                      {!s.visible && (
                        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          — Masque
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{s.title}</h3>
                    <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {s.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100" style={{ color: "var(--color-copper)" }} />
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  <span className="font-mono">/{s.slug}</span>
                  <span className="font-mono">idx: {s.orderIdx}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
