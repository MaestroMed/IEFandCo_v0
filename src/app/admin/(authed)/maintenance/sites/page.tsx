import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getSites, getEquipmentCountsBySite, getContractCountsBySite } from "../queries";

export const dynamic = "force-dynamic";

export default async function SitesListPage() {
  const sites = await getSites();
  const equipmentCounts = await getEquipmentCountsBySite();
  const contractCounts = await getContractCountsBySite();

  return (
    <>
      <Topbar
        title="Sites"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Sites" },
        ]}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {sites.length} site{sites.length > 1 ? "s" : ""} client
          </p>
          <Link
            href="/admin/maintenance/sites/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouveau site
          </Link>
        </div>

        {sites.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucun site enregistre"
            description="Creez un site pour commencer a suivre les equipements et organiser les visites."
            actionLabel="Creer un site"
            actionHref="/admin/maintenance/sites/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Site</th>
                  <th className="px-4 py-3 font-medium">Ville</th>
                  <th className="px-4 py-3 font-medium text-right">Equipements</th>
                  <th className="px-4 py-3 font-medium text-right">Contrats</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((s) => (
                  <tr key={s.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/maintenance/sites/${s.id}`} className="font-medium hover:text-primary transition-colors" style={{ color: "var(--text)" }}>
                        {s.clientName}
                      </Link>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {s.label || "—"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {s.city || "—"}
                      {s.postalCode && <span className="ml-2 font-mono text-xs">{s.postalCode}</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text)" }}>
                      {equipmentCounts[s.id] || 0}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text)" }}>
                      {contractCounts[s.id] || 0}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {s.contactName || "—"}
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
