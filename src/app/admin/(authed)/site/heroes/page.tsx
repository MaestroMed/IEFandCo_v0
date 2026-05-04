import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { inArray } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { PAGE_HERO_KEYS } from "./constants";

export const dynamic = "force-dynamic";

export default async function HeroesListPage() {
  const rows = await db
    .select()
    .from(schema.pageHeroes)
    .where(
      inArray(
        schema.pageHeroes.key,
        PAGE_HERO_KEYS.map((p) => p.key),
      ),
    );

  const byKey = new Map(rows.map((r) => [r.key, r]));

  // Resolve media URLs in a single round trip
  const mediaIds = rows.map((r) => r.mediaId).filter((x): x is string => Boolean(x));
  const mediaMap = new Map<string, string>();
  if (mediaIds.length > 0) {
    const m = await db
      .select({ id: schema.media.id, url: schema.media.url })
      .from(schema.media)
      .where(inArray(schema.media.id, mediaIds));
    for (const row of m) mediaMap.set(row.id, row.url);
  }

  const configuredCount = rows.length;

  return (
    <>
      <Topbar
        title="Heros par page"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Site" },
          { label: "Heros pages" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div
          className="rounded-lg p-4"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--text)" }}>
            Surcharges des heros pour les pages statiques (titre, eyebrow, intro, image de fond).
            Si vide, la page utilise son hero code par defaut.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {configuredCount} page{configuredCount > 1 ? "s" : ""} configuree{configuredCount > 1 ? "s" : ""} sur {PAGE_HERO_KEYS.length}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAGE_HERO_KEYS.map((entry) => {
            const row = byKey.get(entry.key);
            const isConfigured = !!row;
            const isEnabled = !!row?.enabled;
            const mediaUrl = row?.mediaId ? mediaMap.get(row.mediaId) : undefined;
            const eyebrow = row?.eyebrow || "";
            const title = row?.title || "";

            return (
              <Link
                key={entry.key}
                href={`/admin/site/heroes/${entry.key}`}
                className="group relative rounded-xl p-5 transition-all hover:-translate-y-0.5"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <span
                  className="pointer-events-none absolute left-2 top-2 h-2 w-2 transition-colors group-hover:border-[var(--color-copper)]"
                  style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}
                />
                <span
                  className="pointer-events-none absolute right-2 top-2 h-2 w-2 transition-colors group-hover:border-[var(--color-copper)]"
                  style={{ borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
                />

                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div
                    className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden flex items-center justify-center"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}
                  >
                    {mediaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition: row?.objectPosition || "center 50%" }}
                      />
                    ) : (
                      <ImageIcon
                        className="h-5 w-5"
                        style={{ color: "var(--text-muted)", opacity: 0.5 }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-display text-base font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {entry.label}
                      </h3>
                      {isConfigured ? (
                        isEnabled ? (
                          <span
                            className="font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgb(34 197 94 / 0.12)",
                              color: "rgb(34 197 94)",
                            }}
                          >
                            Configure
                          </span>
                        ) : (
                          <span
                            className="font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                            style={{
                              background: "var(--bg-muted)",
                              color: "var(--text-muted)",
                            }}
                          >
                            Desactive
                          </span>
                        )
                      ) : (
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.15em]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Defaut
                        </span>
                      )}
                    </div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.15em]"
                      style={{ color: "var(--color-copper)" }}
                    >
                      {entry.description}
                    </p>
                    <div className="mt-2 space-y-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      <div className="truncate">
                        <span className="opacity-60">Eyebrow : </span>
                        {eyebrow ? (
                          <span style={{ color: "var(--text)" }}>{eyebrow}</span>
                        ) : (
                          <span>defaut</span>
                        )}
                      </div>
                      <div className="truncate">
                        <span className="opacity-60">Titre : </span>
                        {title ? (
                          <span style={{ color: "var(--text)" }}>{title.split("\n")[0]}</span>
                        ) : (
                          <span>defaut</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--color-copper)" }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
