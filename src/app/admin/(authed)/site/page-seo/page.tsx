import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { PageSeoCard } from "./PageSeoForm";
import { PAGE_SEO_KEYS } from "./constants";

export const dynamic = "force-dynamic";

export default async function PageSeoListPage() {
  const rows = await db.select().from(schema.pageSeo);
  const byKey = new Map(rows.map((r) => [r.key, r]));

  return (
    <>
      <Topbar
        title="SEO pages"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Site" },
          { label: "SEO pages" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="rounded-lg p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            Surcharges des metadonnees SEO pour les pages statiques. Si vide, les valeurs par defaut codees s&apos;appliquent.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {rows.length} cle{rows.length > 1 ? "s" : ""} configuree{rows.length > 1 ? "s" : ""} sur {PAGE_SEO_KEYS.length}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PAGE_SEO_KEYS.map((entry) => {
            const row = byKey.get(entry.key);
            return (
              <PageSeoCard
                key={entry.key}
                rowKey={entry.key}
                label={entry.label}
                description={entry.description}
                initial={
                  row
                    ? {
                        key: row.key,
                        title: row.title,
                        description: row.description,
                        ogMediaId: row.ogMediaId,
                      }
                    : null
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
