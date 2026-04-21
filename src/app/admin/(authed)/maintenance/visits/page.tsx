import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getVisits } from "../queries";
import { VISIT_STATUSES, VISIT_TYPES, VISIT_STATUS_LABELS, VISIT_TYPE_LABELS } from "../constants";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  type?: string;
  range?: "today" | "week" | "month" | "past" | "all";
  from?: string;
  to?: string;
}

function getRangeBounds(range: SearchParams["range"]): { from?: Date; to?: Date } {
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const endDay = new Date(now); endDay.setHours(23, 59, 59, 999);
  if (range === "today") {
    return { from: start, to: endDay };
  }
  if (range === "week") {
    const day = start.getDay() || 7; // monday-based
    const monday = new Date(start); monday.setDate(start.getDate() - (day - 1));
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23, 59, 59, 999);
    return { from: monday, to: sunday };
  }
  if (range === "month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { from: monthStart, to: monthEnd };
  }
  if (range === "past") {
    return { to: start };
  }
  return {};
}

export default async function VisitsListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const range = params.range || "all";
  const bounds = getRangeBounds(range);

  const visits = await getVisits({
    status: (VISIT_STATUSES as readonly string[]).includes(params.status || "") ? (params.status as "scheduled" | "in_progress" | "done" | "cancelled") : undefined,
    type: (VISIT_TYPES as readonly string[]).includes(params.type || "") ? (params.type as "preventive" | "curative" | "audit") : undefined,
    from: params.from ? new Date(params.from) : bounds.from,
    to: params.to ? new Date(params.to) : bounds.to,
  });

  const ranges = [
    { key: "today", label: "Aujourd'hui" },
    { key: "week", label: "Cette semaine" },
    { key: "month", label: "Ce mois" },
    { key: "past", label: "Passees" },
    { key: "all", label: "Toutes" },
  ] as const;

  const inputCls = "rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";
  const inputStyle = { border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" };

  return (
    <>
      <Topbar
        title="Visites"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Visites" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {visits.length} visite{visits.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/maintenance/visits/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Programmer une visite
          </Link>
        </div>

        {/* Range tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b" style={{ borderColor: "var(--border)" }}>
          {ranges.map((r) => {
            const isActive = range === r.key;
            const url = new URLSearchParams();
            if (r.key !== "all") url.set("range", r.key);
            if (params.status) url.set("status", params.status);
            if (params.type) url.set("type", params.type);
            const query = url.toString();
            return (
              <Link
                key={r.key}
                href={`/admin/maintenance/visits${query ? `?${query}` : ""}`}
                className="px-4 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2"
                style={{
                  borderColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {r.label}
              </Link>
            );
          })}
        </div>

        {/* Filters */}
        <form method="get" action="/admin/maintenance/visits" className="flex flex-wrap gap-3">
          {range !== "all" && <input type="hidden" name="range" value={range} />}
          <select name="status" defaultValue={params.status || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous status</option>
            {VISIT_STATUSES.map((s) => (
              <option key={s} value={s}>{VISIT_STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select name="type" defaultValue={params.type || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous types</option>
            {VISIT_TYPES.map((t) => (
              <option key={t} value={t}>{VISIT_TYPE_LABELS[t]}</option>
            ))}
          </select>
          <input type="date" name="from" defaultValue={params.from || ""} className={`${inputCls} font-mono`} style={inputStyle} />
          <input type="date" name="to" defaultValue={params.to || ""} className={`${inputCls} font-mono`} style={inputStyle} />
          <button type="submit" className="rounded-lg px-4 py-2 text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Filtrer
          </button>
        </form>

        {visits.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucune visite"
            description="Aucune visite ne correspond aux filtres choisis."
            actionLabel="Programmer une visite"
            actionHref="/admin/maintenance/visits/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Equipement</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Technicien</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Duree</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((row) => (
                  <tr key={row.visit.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/admin/maintenance/visits/${row.visit.id}`} className="hover:text-primary" style={{ color: "var(--text)" }}>
                        {new Date(row.visit.scheduledFor).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
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
                      {row.technician?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <VisitStatusPill status={row.visit.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text-muted)" }}>
                      {row.visit.durationMinutes ? `${row.visit.durationMinutes} min` : "—"}
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
