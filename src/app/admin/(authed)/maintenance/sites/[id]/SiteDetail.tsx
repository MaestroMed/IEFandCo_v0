"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Calendar, FileSignature, Plus, Wrench } from "lucide-react";
import { SiteForm } from "../SiteForm";
import { EmptyState } from "@/components/admin/EmptyState";
import { CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS, EQUIPMENT_STATUS_LABELS, VISIT_STATUS_LABELS, VISIT_TYPE_LABELS } from "../../constants";
import type { Contract, Equipment, MaintenanceVisit, Site } from "@/db/schema";

type EnrichedVisit = MaintenanceVisit & { equipmentLabel: string | null };

interface Props {
  site: Site;
  equipment: Equipment[];
  contracts: Contract[];
  visits: EnrichedVisit[];
  initialTab: "infos" | "equipement" | "contrats" | "historique";
}

export function SiteDetail({ site, equipment, contracts, visits, initialTab }: Props) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="p-8 space-y-6">
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { key: "infos", label: "Infos", icon: Building2 },
          { key: "equipement", label: `Equipements (${equipment.length})`, icon: Wrench },
          { key: "contrats", label: `Contrats (${contracts.length})`, icon: FileSignature },
          { key: "historique", label: `Historique (${visits.length})`, icon: Calendar },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2"
              style={{
                borderColor: active ? "var(--color-primary)" : "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "infos" && (
        <SiteForm
          siteId={site.id}
          initial={{
            clientName: site.clientName,
            label: site.label,
            address: site.address,
            city: site.city,
            postalCode: site.postalCode,
            accessInstructions: site.accessInstructions,
            contactName: site.contactName,
            contactEmail: site.contactEmail,
            contactPhone: site.contactPhone,
            notes: site.notes,
          }}
        />
      )}

      {tab === "equipement" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {equipment.length} equipement{equipment.length > 1 ? "s" : ""} sur ce site
            </p>
            <Link
              href={`/admin/maintenance/equipment/new?siteId=${site.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter un equipement
            </Link>
          </div>
          {equipment.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="Aucun equipement"
              description="Inventoriez les portes, portails et automatismes de ce site."
              actionLabel="Ajouter un equipement"
              actionHref={`/admin/maintenance/equipment/new?siteId=${site.id}`}
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Libelle</th>
                    <th className="px-4 py-3 font-medium">Marque / modele</th>
                    <th className="px-4 py-3 font-medium">Localisation</th>
                    <th className="px-4 py-3 font-medium">Pose</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((e) => (
                    <tr key={e.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                        {e.type}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/maintenance/equipment/${e.id}`} className="hover:text-primary transition-colors font-medium" style={{ color: "var(--text)" }}>
                          {e.label || "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                        {[e.brand, e.model].filter(Boolean).join(" ") || "—"}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                        {e.location || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {e.installDate ? new Date(e.installDate).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <EquipmentStatusPill status={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "contrats" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {contracts.length} contrat{contracts.length > 1 ? "s" : ""}
            </p>
            <Link
              href={`/admin/maintenance/contracts/new?siteId=${site.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Nouveau contrat
            </Link>
          </div>
          {contracts.length === 0 ? (
            <EmptyState
              icon={FileSignature}
              title="Aucun contrat"
              description="Aucun engagement enregistre pour ce site."
              actionLabel="Creer un contrat"
              actionHref={`/admin/maintenance/contracts/new?siteId=${site.id}`}
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
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
                  {contracts.map((c) => (
                    <tr key={c.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3">
                        <Link href={`/admin/maintenance/contracts/${c.id}`} className="font-mono text-xs uppercase tracking-wider hover:text-primary transition-colors" style={{ color: "var(--color-copper)" }}>
                          {CONTRACT_TYPE_LABELS[c.type as keyof typeof CONTRACT_TYPE_LABELS]}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(c.startDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {c.endDate ? new Date(c.endDate).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text)" }}>
                        {c.slaHours ? `${c.slaHours}h` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {c.frequencyMonths} mois
                      </td>
                      <td className="px-4 py-3">
                        <ContractStatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text)" }}>
                        {c.amountHt ? `${(c.amountHt / 100).toLocaleString("fr-FR")} €` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "historique" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {visits.length} intervention{visits.length > 1 ? "s" : ""} sur ce site
            </p>
            <Link
              href={`/admin/maintenance/visits/new?siteId=${site.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Programmer une visite
            </Link>
          </div>
          {visits.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Aucune intervention"
              description="Aucune visite n'a encore ete planifiee ou realisee sur ce site."
              actionLabel="Programmer une visite"
              actionHref={`/admin/maintenance/visits/new?siteId=${site.id}`}
            />
          ) : (
            <ol className="space-y-4 relative border-l pl-6" style={{ borderColor: "var(--border)" }}>
              {visits.map((v) => (
                <li key={v.id} className="relative">
                  <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full" style={{ background: "var(--color-copper)" }} />
                  <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <Link href={`/admin/maintenance/visits/${v.id}`} className="font-display font-semibold text-base hover:text-primary" style={{ color: "var(--text)" }}>
                            {VISIT_TYPE_LABELS[v.type as keyof typeof VISIT_TYPE_LABELS]}
                          </Link>
                          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                            {new Date(v.scheduledFor).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                          </span>
                        </div>
                        {v.equipmentLabel && (
                          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                            Equipement : {v.equipmentLabel}
                          </p>
                        )}
                        {v.reportMd && (
                          <p className="mt-2 text-sm whitespace-pre-wrap line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                            {v.reportMd}
                          </p>
                        )}
                      </div>
                      <VisitStatusPill status={v.status} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
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
