import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getEquipmentForEquipmentList, getLastVisitByEquipment, getSites } from "../queries";
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES, EQUIPMENT_STATUS_LABELS } from "../constants";

export const dynamic = "force-dynamic";

interface SearchParams {
  type?: string;
  site?: string;
  status?: string;
}

export default async function EquipmentListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const all = await getEquipmentForEquipmentList();
  const lastVisits = await getLastVisitByEquipment();
  const sites = await getSites();

  const filtered = all.filter((row) => {
    if (params.type && row.eq.type !== params.type) return false;
    if (params.site && row.eq.siteId !== params.site) return false;
    if (params.status && row.eq.status !== params.status) return false;
    return true;
  });

  const inputCls = "rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";
  const inputStyle = { border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" };

  return (
    <>
      <Topbar
        title="Equipements"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Equipements" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {filtered.length} equipement{filtered.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/maintenance/equipment/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter equipement
          </Link>
        </div>

        <form method="get" action="/admin/maintenance/equipment" className="flex flex-wrap gap-3">
          <select name="type" defaultValue={params.type || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous types</option>
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select name="site" defaultValue={params.site || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.clientName} {s.label ? `— ${s.label}` : ""}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={params.status || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous status</option>
            {EQUIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{EQUIPMENT_STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button type="submit" className="rounded-lg px-4 py-2 text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Filtrer
          </button>
        </form>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="Aucun equipement"
            description="Aucun equipement ne correspond aux filtres choisis."
            actionLabel="Ajouter un equipement"
            actionHref="/admin/maintenance/equipment/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Libelle</th>
                  <th className="px-4 py-3 font-medium">Marque / modele</th>
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Pose</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Derniere visite</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.eq.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                      {row.eq.type}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/maintenance/equipment/${row.eq.id}`} className="font-medium hover:text-primary transition-colors" style={{ color: "var(--text)" }}>
                        {row.eq.label || "Sans libelle"}
                      </Link>
                      {row.eq.location && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {row.eq.location}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {[row.eq.brand, row.eq.model].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {row.site ? (
                        <Link href={`/admin/maintenance/sites/${row.site.id}`} className="hover:text-primary">
                          {row.site.clientName}
                          {row.site.label && <span className="block text-xs">{row.site.label}</span>}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {row.eq.installDate ? new Date(row.eq.installDate).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentStatusPill status={row.eq.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {lastVisits[row.eq.id] ? lastVisits[row.eq.id]!.toLocaleDateString("fr-FR") : "—"}
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

function EquipmentStatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    active: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    faulty: { bg: "rgba(225,16,33,0.12)", fg: "var(--color-primary)" },
    retired: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
  };
  const c = colors[status] || colors.active;
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
      {EQUIPMENT_STATUS_LABELS[status as keyof typeof EQUIPMENT_STATUS_LABELS] || status}
    </span>
  );
}
