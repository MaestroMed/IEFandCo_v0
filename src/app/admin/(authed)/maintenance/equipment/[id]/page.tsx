import { Topbar } from "@/components/admin/Topbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { EquipmentForm } from "../EquipmentForm";
import { getEquipmentById, getSites, getVisitsForEquipment } from "../../queries";
import { VISIT_STATUS_LABELS, VISIT_TYPE_LABELS } from "../../constants";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eq = await getEquipmentById(id);
  if (!eq) notFound();
  const sites = await getSites();
  const visits = await getVisitsForEquipment(id);

  const title = eq.label || `${eq.type} (${eq.id.slice(0, 6)})`;

  return (
    <>
      <Topbar
        title={title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Equipements", href: "/admin/maintenance/equipment" },
          { label: title },
        ]}
      />
      <div className="p-8 space-y-8">
        <EquipmentForm
          equipmentId={eq.id}
          sites={sites.map((s) => ({ id: s.id, clientName: s.clientName, label: s.label }))}
          initial={{
            siteId: eq.siteId,
            type: eq.type,
            brand: eq.brand,
            model: eq.model,
            serial: eq.serial,
            installDate: eq.installDate,
            warrantyEnd: eq.warrantyEnd,
            label: eq.label,
            location: eq.location,
            notes: eq.notes,
            status: eq.status,
          }}
        />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
              Historique des interventions
            </h2>
            <Link
              href={`/admin/maintenance/visits/new?equipmentId=${eq.id}&siteId=${eq.siteId}`}
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
              description="Aucune visite n'a encore ete enregistree pour cet equipement."
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
                    <th className="px-4 py-3 font-medium">Date prevue</th>
                    <th className="px-4 py-3 font-medium">Realisee le</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Duree</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v) => (
                    <tr key={v.id} className="border-t transition-colors hover:bg-[var(--bg-muted)]" style={{ borderColor: "var(--border)" }}>
                      <td className="px-4 py-3 font-mono text-xs">
                        <Link href={`/admin/maintenance/visits/${v.id}`} className="hover:text-primary" style={{ color: "var(--text)" }}>
                          {new Date(v.scheduledFor).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                        {v.doneAt ? new Date(v.doneAt).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                        {VISIT_TYPE_LABELS[v.type as keyof typeof VISIT_TYPE_LABELS]}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {VISIT_STATUS_LABELS[v.status as keyof typeof VISIT_STATUS_LABELS]}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-right" style={{ color: "var(--text-muted)" }}>
                        {v.durationMinutes ? `${v.durationMinutes} min` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
