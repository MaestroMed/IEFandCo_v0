import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq, count, gte, sql, and, asc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Inbox, FolderKanban, FileText, TrendingUp, Wrench, Calendar as CalendarIcon } from "lucide-react";

// Admin pages must render on-demand — they query DB + require auth
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDashboardData() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Empty buckets (fallback if DB unavailable)
  const emptyBuckets: { label: string; date: Date; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    emptyBuckets.push({ label: d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""), date: d, count: 0 });
  }

  const emptyState = {
    leads: { total: 0, unread: 0, thisWeek: 0, won: 0 },
    projects: { published: 0, draft: 0 },
    posts: { published: 0, draft: 0 },
    latestLeads: [] as Array<typeof schema.leads.$inferSelect>,
    weekly: emptyBuckets,
    upcomingVisits: [] as Array<typeof schema.maintenanceVisits.$inferSelect>,
  };

  try {
    const [
      leadsTotal,
      leadsNew,
      leadsThisWeek,
      leadsWon,
      projectsPublished,
      projectsDraft,
      postsPublished,
      postsDraft,
      latestLeads,
      leadsLastWeek,
      upcomingVisits,
    ] = await Promise.all([
      db.select({ c: count() }).from(schema.leads),
      db.select({ c: count() }).from(schema.leads).where(eq(schema.leads.status, "new")),
      db.select({ c: count() }).from(schema.leads).where(gte(schema.leads.receivedAt, weekAgo)),
      db.select({ c: count() }).from(schema.leads).where(eq(schema.leads.status, "won")),
      db.select({ c: count() }).from(schema.projects).where(eq(schema.projects.status, "published")),
      db.select({ c: count() }).from(schema.projects).where(eq(schema.projects.status, "draft")),
      db.select({ c: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.status, "published")),
      db.select({ c: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.status, "draft")),
      db.select().from(schema.leads).orderBy(sql`${schema.leads.receivedAt} DESC`).limit(5),
      db.select({ at: schema.leads.receivedAt }).from(schema.leads).where(gte(schema.leads.receivedAt, weekAgo)),
      db
        .select()
        .from(schema.maintenanceVisits)
        .where(and(gte(schema.maintenanceVisits.scheduledFor, now), eq(schema.maintenanceVisits.status, "scheduled")))
        .orderBy(asc(schema.maintenanceVisits.scheduledFor))
        .limit(5),
    ]);

    // Build per-day buckets for the last 7 days (oldest -> newest)
    const buckets = [...emptyBuckets];
    for (const row of leadsLastWeek) {
      const d = row.at instanceof Date ? row.at : new Date(row.at);
      const key = new Date(d);
      key.setHours(0, 0, 0, 0);
      const idx = buckets.findIndex((b) => b.date.getTime() === key.getTime());
      if (idx >= 0) buckets[idx].count++;
    }

    return {
      leads: {
        total: leadsTotal[0].c,
        unread: leadsNew[0].c,
        thisWeek: leadsThisWeek[0].c,
        won: leadsWon[0].c,
      },
      projects: { published: projectsPublished[0].c, draft: projectsDraft[0].c },
      posts: { published: postsPublished[0].c, draft: postsDraft[0].c },
      latestLeads,
      weekly: buckets,
      upcomingVisits,
    };
  } catch (err) {
    console.warn("[admin/dashboard] DB query failed, returning empty state:", err instanceof Error ? err.message : err);
    return emptyState;
  }
}

function KPICard({ label, value, sub, icon: Icon, href, accent }: { label: string; value: string | number; sub?: string; icon: typeof Inbox; href?: string; accent?: boolean }) {
  const inner = (
    <div
      className="rounded-xl p-5 transition-all hover:-translate-y-0.5 h-full"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5" style={{ color: accent ? "var(--color-primary)" : "var(--color-copper)" }} />
        {href && <ArrowRight className="h-4 w-4 opacity-30" />}
      </div>
      <div className="mt-6">
        <div className="font-mono text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</div>
        <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{label}</div>
        {sub && <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function WeeklyChart({ data }: { data: { label: string; date: Date; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  // SVG dims
  const w = 320;
  const h = 120;
  const pad = { top: 8, right: 8, bottom: 22, left: 8 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const barW = innerW / data.length - 6;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>Semaine passee</h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {total} lead{total > 1 ? "s" : ""} sur 7 jours · max {max}/jour
          </p>
        </div>
        <Inbox className="h-4 w-4" style={{ color: "var(--color-copper)" }} />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Leads par jour sur les 7 derniers jours">
        {data.map((d, i) => {
          const x = pad.left + i * (innerW / data.length) + 3;
          const barH = (d.count / max) * innerH;
          const y = pad.top + (innerH - barH);
          const isToday = i === data.length - 1;
          return (
            <g key={i}>
              <rect
                x={x}
                y={pad.top}
                width={barW}
                height={innerH}
                fill="var(--bg-muted)"
                opacity={0.4}
                rx={3}
              />
              {d.count > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  fill={isToday ? "var(--color-primary)" : "var(--color-copper)"}
                  rx={3}
                >
                  <title>{`${d.label} ${d.date.toLocaleDateString("fr-FR")}: ${d.count} lead${d.count > 1 ? "s" : ""}`}</title>
                </rect>
              )}
              {d.count > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 3}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="var(--text)"
                >
                  {d.count}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={h - 6}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fill="var(--text-muted)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function VisitsWidget({ visits }: { visits: { id: string; scheduledFor: Date; type: string; status: string; notes: string | null; siteId: string | null; equipmentId: string | null }[] }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>Prochaines visites</h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{visits.length} programmee{visits.length > 1 ? "s" : ""}</p>
        </div>
        <Wrench className="h-4 w-4" style={{ color: "var(--color-copper)" }} />
      </div>
      {visits.length === 0 ? (
        <div className="py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          <CalendarIcon className="mx-auto mb-2 h-5 w-5 opacity-40" />
          Aucune visite programmee.
        </div>
      ) : (
        <ul className="space-y-2">
          {visits.map((v) => {
            const d = v.scheduledFor instanceof Date ? v.scheduledFor : new Date(v.scheduledFor);
            return (
              <li key={v.id}>
                <Link
                  href={`/admin/maintenance/visits/${v.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--bg-muted)]"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg"
                    style={{ background: "var(--bg-muted)" }}
                  >
                    <span className="font-mono text-[9px] uppercase" style={{ color: "var(--text-muted)" }}>
                      {d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}
                    </span>
                    <span className="font-display text-sm font-bold" style={{ color: "var(--text)" }}>
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      Visite {v.type}
                    </p>
                    <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {v.notes || "—"}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/admin/calendar"
        className="mt-3 block text-center text-xs transition-colors hover:text-primary"
        style={{ color: "var(--color-copper)" }}
      >
        Voir le planning complet →
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Conversion rate = won / total (gagnés sur leads totaux). Affiche un dash si pas encore de leads.
  const conversionRate =
    data.leads.total > 0
      ? `${((data.leads.won / data.leads.total) * 100).toFixed(1)}%`
      : "—";
  const conversionSub =
    data.leads.total > 0
      ? `${data.leads.won} gagné${data.leads.won > 1 ? "s" : ""} sur ${data.leads.total}`
      : "Aucun lead pour l'instant";

  return (
    <>
      <Topbar title="Dashboard" breadcrumb={[{ label: "Admin" }, { label: "Overview" }]} />

      <div className="p-8 space-y-8">
        {/* Alerts banner */}
        {data.leads.unread > 0 && (
          <Link
            href="/admin/leads?status=new"
            className="block rounded-xl p-4 transition-all hover:-translate-y-0.5"
            style={{
              background: "color-mix(in oklab, var(--color-primary) 8%, var(--card-bg))",
              border: "1px solid color-mix(in oklab, var(--color-primary) 30%, transparent)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--color-primary) 15%, transparent)" }}>
                <Inbox className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: "var(--text)" }}>
                  {data.leads.unread} nouveau{data.leads.unread > 1 ? "x" : ""} lead{data.leads.unread > 1 ? "s" : ""} a traiter
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Les nouveaux contacts et demandes de devis en attente
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </Link>
        )}

        {/* KPIs */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Indicateurs cles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              label="Leads totaux"
              value={data.leads.total}
              sub={`${data.leads.thisWeek} cette semaine`}
              icon={Inbox}
              href="/admin/leads"
              accent={data.leads.unread > 0}
            />
            <KPICard
              label="Realisations"
              value={data.projects.published}
              sub={`${data.projects.draft} en brouillon`}
              icon={FolderKanban}
              href="/admin/projects"
            />
            <KPICard
              label="Articles publies"
              value={data.posts.published}
              sub={`${data.posts.draft} en brouillon`}
              icon={FileText}
              href="/admin/blog"
            />
            <KPICard
              label="Taux conversion"
              value={conversionRate}
              sub={conversionSub}
              icon={TrendingUp}
            />
          </div>
        </section>

        {/* Weekly chart */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyChart data={data.weekly} />
          </div>
          <VisitsWidget visits={data.upcomingVisits} />
        </section>

        {/* Recent leads + visits */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                Derniers leads
              </h2>
              <Link href="/admin/leads" className="text-sm text-copper hover:text-primary transition-colors">
                Tout voir →
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              {data.latestLeads.length === 0 ? (
                <div className="p-12 text-center">
                  <Inbox className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Aucun lead recu pour l&apos;instant.</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Les soumissions du site apparaitront ici.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Nom</th>
                      <th className="px-4 py-3 font-medium">Entreprise</th>
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestLeads.map((l) => (
                      <tr key={l.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                            style={{
                              background: l.type === "devis" ? "rgba(225,16,33,0.1)" : "rgba(196,133,92,0.1)",
                              color: l.type === "devis" ? "var(--color-primary)" : "var(--color-copper)",
                            }}>
                            {l.type}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                          <Link href={`/admin/leads/${l.id}`} className="hover:text-primary transition-colors font-medium">
                            {l.firstName} {l.lastName}
                          </Link>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{l.company || "—"}</td>
                        <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{l.service || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs" style={{ color: l.status === "new" ? "var(--color-primary)" : "var(--text-muted)" }}>
                            {l.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                          {new Date(l.receivedAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
