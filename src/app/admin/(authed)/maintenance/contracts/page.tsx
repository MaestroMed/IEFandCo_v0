import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { FileSignature, Plus } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getContracts } from "../queries";
import { CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS } from "../constants";

export const dynamic = "force-dynamic";

function getRowState(endDate: Date | null): "active" | "expired" | "soon" {
  if (!endDate) return "active";
  const now = Date.now();
  const end = new Date(endDate).getTime();
  if (end < now) return "expired";
  if (end - now < 30 * 24 * 60 * 60 * 1000) return "soon";
  return "active";
}

export default async function ContractsListPage() {
  const rows = await getContracts();

  return (
    <>
      <Topbar
        title="Contrats"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Contrats" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} contrat{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/maintenance/contracts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nouveau contrat
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title="Aucun contrat enregistre"
            description="Creez un contrat de maintenance pour suivre les engagements et SLA."
            actionLabel="Creer un contrat"
            actionHref="/admin/maintenance/contracts/new"
          />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                  <th className="px-4 py-3 font-medium w-2"></th>
                  <th className="px-4 py-3 font-medium">Client / site</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Debut</th>
                  <th className="px-4 py-3 font-medium">Fin</th>
                  <th className="px-4 py-3 font-medium">SLA</th>
                  <th className="px-4 py-3 font-medium">Frequence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const state = row.contract.status === "active" ? getRowState(row.contract.endDate) : null;
                  const stripeColor =
                    state === "expired" ? "var(--color-primary)" :
                    state === "soon" ? "var(--color-copper)" :
                    state === "active" ? "#3CAA8C" : "var(--border)";
                  return (
                    <tr key={row.contract.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-2 py-3">
                        <span className="block h-6 w-1 rounded-full" style={{ background: stripeColor }} />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/maintenance/contracts/${row.contract.id}`} className="font-medium hover:text-primary transition-colors" style={{ color: "var(--text)" }}>
                          {row.site?.clientName || "—"}
                        </Link>
                        {row.site?.label && <div className="text-xs" style={{ color: "var(--text-muted)" }}>{row.site.label}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                        {CONTRACT_TYPE_LABELS[row.contract.type as keyof typeof CONTRACT_TYPE_LABELS]}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(row.contract.startDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {row.contract.endDate ? new Date(row.contract.endDate).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text)" }}>
                        {row.contract.slaHours ? `${row.contract.slaHours}h` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {row.contract.frequencyMonths} mois
                      </td>
                      <td className="px-4 py-3">
                        <ContractStatusPill status={row.contract.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text)" }}>
                        {row.contract.amountHt ? `${(row.contract.amountHt / 100).toLocaleString("fr-FR")} €` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function ContractStatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    active: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    expired: { bg: "rgba(225,16,33,0.12)", fg: "var(--color-primary)" },
    pending: { bg: "rgba(196,133,92,0.12)", fg: "var(--color-copper)" },
  };
  const c = colors[status] || colors.active;
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
      {CONTRACT_STATUS_LABELS[status as keyof typeof CONTRACT_STATUS_LABELS] || status}
    </span>
  );
}
