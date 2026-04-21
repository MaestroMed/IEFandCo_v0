import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, Calendar, ClipboardList, FileSignature, MapPin, Wrench } from "lucide-react";
import { getMaintenanceOverview, getUpcomingVisits } from "./queries";
import { VISIT_TYPE_LABELS, VISIT_STATUS_LABELS } from "./constants";

export const dynamic = "force-dynamic";

export default async function MaintenanceOverviewPage() {
  const overview = await getMaintenanceOverview();
  const upcoming = await getUpcomingVisits(30);

  return (
    <>
      <Topbar title="Maintenance" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Maintenance" }]} />

      <div className="p-8 space-y-8">
        {/* Alerts */}
        {(overview.overdueVisits > 0 || overview.expiringContracts > 0) && (
          <section className="grid gap-3 md:grid-cols-2">
            {overview.overdueVisits > 0 && (
              <Link
                href="/admin/maintenance/visits?status=scheduled"
                className="flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: "color-mix(in oklab, var(--color-primary) 8%, var(--card-bg))",
                  border: "1px solid color-mix(in oklab, var(--color-primary) 30%, transparent)",
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--color-primary) 15%, transparent)" }}>
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    {overview.overdueVisits} visite{overview.overdueVisits > 1 ? "s" : ""} en retard
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Visites planifiees dont la date est passee
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </Link>
            )}
            {overview.expiringContracts > 0 && (
              <Link
                href="/admin/maintenance/contracts"
                className="flex items-center gap-4 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: "color-mix(in oklab, var(--color-copper) 8%, var(--card-bg))",
                  border: "1px solid color-mix(in oklab, var(--color-copper) 30%, transparent)",
                }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--color-copper) 15%, transparent)" }}>
                  <FileSignature className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    {overview.expiringContracts} contrat{overview.expiringContracts > 1 ? "s" : ""} a renouveler
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Expiration dans les 30 prochains jours</p>
                </div>
                <ArrowRight className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
              </Link>
            )}
          </section>
        )}

        {/* KPIs */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
            Vue d&apos;ensemble parc
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard label="Sites suivis" value={overview.sitesCount} icon={Building2} href="/admin/maintenance/sites" />
            <KPICard label="Equipements" value={overview.equipmentCount} icon={Wrench} href="/admin/maintenance/equipment" />
            <KPICard label="Visites ce mois" value={overview.visitsThisMonth} icon={Calendar} href="/admin/maintenance/visits" />
            <KPICard label="Contrats actifs" value={overview.contractsActive} icon={FileSignature} href="/admin/maintenance/contracts" />
          </div>
        </section>

        {/* Upcoming visits */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
              Prochaines visites (30 jours)
            </h2>
            <Link href="/admin/maintenance/visits" className="text-sm transition-colors hover:text-primary" style={{ color: "var(--color-copper)" }}>
              Voir tout →
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            {upcoming.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Aucune visite planifiee dans les 30 prochains jours.</p>
                <Link
                  href="/admin/maintenance/visits/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
                >
                  Programmer une visite
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Site</th>
                    <th className="px-4 py-3 font-medium">Equipement</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Technicien</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((row) => (
                    <tr key={row.visit.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text)" }}>
                        <Link href={`/admin/maintenance/visits/${row.visit.id}`} className="hover:text-primary">
                          {new Date(row.visit.scheduledFor).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </Link>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                        {row.site?.clientName || "—"}
                        {row.site?.label && <span className="block text-xs" style={{ color: "var(--text-muted)" }}>{row.site.label}</span>}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                        {row.equipment ? (row.equipment.label || row.equipment.type) : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                        {VISIT_TYPE_LABELS[row.visit.type as keyof typeof VISIT_TYPE_LABELS]}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                        {row.technician?.name || "Non assigne"}
                      </td>
                      <td className="px-4 py-3">
                        <VisitStatusPill status={row.visit.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
            Acces rapides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLink href="/admin/maintenance/sites" icon={MapPin} title="Sites" desc="Gerer les sites client et leurs contacts" />
            <QuickLink href="/admin/maintenance/equipment" icon={Wrench} title="Equipements" desc="Inventorier portes, portails et automatismes" />
            <QuickLink href="/admin/maintenance/visits" icon={ClipboardList} title="Visites" desc="Planifier et suivre les interventions" />
            <QuickLink href="/admin/maintenance/contracts" icon={FileSignature} title="Contrats" desc="Suivre les engagements et SLA" />
          </div>
        </section>
      </div>
    </>
  );
}

function KPICard({ label, value, icon: Icon, href }: { label: string; value: number; icon: typeof Wrench; href?: string }) {
  const inner = (
    <div
      className="rounded-xl p-5 transition-all hover:-translate-y-0.5 h-full"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
    >
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
        {href && <ArrowRight className="h-4 w-4 opacity-30" />}
      </div>
      <div className="mt-6">
        <div className="font-mono text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</div>
        <div className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{label}</div>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function QuickLink({ href, icon: Icon, title, desc }: { href: string; icon: typeof Wrench; title: string; desc: string }) {
  return (
    <Link href={href} className="block">
      <div
        className="relative h-full rounded-xl p-5 transition-all hover:-translate-y-0.5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <span className="pointer-events-none absolute left-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute right-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute bottom-2 left-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
        <span className="pointer-events-none absolute bottom-2 right-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />
        <Icon className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
        <h3 className="mt-3 font-display text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </Link>
  );
}

function VisitStatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    scheduled: { bg: "rgba(59,130,180,0.12)", fg: "#3B82B4" },
    in_progress: { bg: "rgba(196,133,92,0.15)", fg: "var(--color-copper)" },
    done: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    cancelled: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
  };
  const c = colors[status] || colors.scheduled;
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
      {VISIT_STATUS_LABELS[status as keyof typeof VISIT_STATUS_LABELS] || status}
    </span>
  );
}
