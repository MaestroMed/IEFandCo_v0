"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { createContract, updateContract, deleteContract } from "../actions";
import { CONTRACT_STATUSES, CONTRACT_TYPES, CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS, FREQUENCY_CHOICES, SLA_CHOICES } from "../constants";

interface SiteOption {
  id: string;
  clientName: string;
  label: string | null;
}

interface ContractFormProps {
  contractId?: string;
  sites: SiteOption[];
  initial?: {
    siteId?: string;
    type?: "preventive" | "full_service" | "on_demand";
    startDate?: Date;
    endDate?: Date | null;
    slaHours?: number | null;
    frequencyMonths?: number;
    amountHt?: number | null;
    status?: "active" | "expired" | "pending";
    notes?: string | null;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

function dateToInput(d?: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function ContractForm({ contractId, sites, initial }: ContractFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generateVisits, setGenerateVisits] = useState(!contractId);
  const [form, setForm] = useState({
    siteId: initial?.siteId || (sites[0]?.id ?? ""),
    type: initial?.type || ("preventive" as "preventive" | "full_service" | "on_demand"),
    startDate: dateToInput(initial?.startDate) || dateToInput(new Date()),
    endDate: dateToInput(initial?.endDate),
    slaHours: initial?.slaHours ? String(initial.slaHours) : "24",
    frequencyMonths: String(initial?.frequencyMonths ?? 6),
    amountEur: initial?.amountHt ? String((initial.amountHt / 100).toFixed(2)) : "",
    status: initial?.status || ("active" as "active" | "expired" | "pending"),
    notes: initial?.notes || "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.siteId) {
      toast.error("Site requis");
      return;
    }
    if (!form.startDate) {
      toast.error("Date de debut requise");
      return;
    }
    start(async () => {
      const amountHt = form.amountEur ? Math.round(Number(form.amountEur) * 100) : null;
      const payload = {
        siteId: form.siteId,
        type: form.type,
        startDate: new Date(form.startDate).getTime(),
        endDate: form.endDate ? new Date(form.endDate).getTime() : null,
        slaHours: form.slaHours ? Number(form.slaHours) : null,
        frequencyMonths: Number(form.frequencyMonths),
        amountHt,
        status: form.status,
        notes: form.notes || null,
        generateVisits: !contractId && generateVisits,
      };
      const res = contractId ? await updateContract(contractId, payload) : await createContract(payload);
      if (res.ok) {
        toast.success(contractId ? "Contrat mis a jour" : "Contrat cree");
        if (!contractId && "id" in res) router.push(`/admin/maintenance/contracts/${res.id}`);
        else router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete() {
    if (!contractId) return;
    start(async () => {
      const res = await deleteContract(contractId);
      if (res.ok) {
        toast.success("Contrat supprime");
        router.push("/admin/maintenance/contracts");
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> En cours...
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/maintenance/contracts")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {contractId ? "Enregistrer" : "Creer le contrat"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Engagement</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Site</label>
              <select className={inputCls} style={inputStyle} value={form.siteId} onChange={(e) => update("siteId", e.target.value)}>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.clientName} {s.label ? `— ${s.label}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Type</label>
                <select className={inputCls} style={inputStyle} value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {CONTRACT_TYPES.map((t) => (
                    <option key={t} value={t}>{CONTRACT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status</label>
                <select className={inputCls} style={inputStyle} value={form.status} onChange={(e) => update("status", e.target.value)}>
                  {CONTRACT_STATUSES.map((s) => (
                    <option key={s} value={s}>{CONTRACT_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Debut</label>
                <input type="date" className={`${inputCls} font-mono`} style={inputStyle} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Fin</label>
                <input type="date" className={`${inputCls} font-mono`} style={inputStyle} value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>SLA &amp; frequence</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>SLA (heures)</label>
                <select className={inputCls} style={inputStyle} value={form.slaHours} onChange={(e) => update("slaHours", e.target.value)}>
                  <option value="">— Aucun SLA —</option>
                  {SLA_CHOICES.map((h) => (
                    <option key={h} value={h}>{h}h</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Frequence (mois)</label>
                <select className={inputCls} style={inputStyle} value={form.frequencyMonths} onChange={(e) => update("frequencyMonths", e.target.value)}>
                  {FREQUENCY_CHOICES.map((f) => (
                    <option key={f} value={f}>{f === 1 ? "1 mois (mensuelle)" : f === 3 ? "3 mois (trimestrielle)" : f === 6 ? "6 mois (semestrielle)" : "12 mois (annuelle)"}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Montant HT (€)</label>
                <input type="number" step="0.01" min={0} className={`${inputCls} font-mono`} style={inputStyle} value={form.amountEur} onChange={(e) => update("amountEur", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Notes</h2>
            <textarea className={inputCls} style={inputStyle} rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </section>
        </div>

        <div className="space-y-6">
          {!contractId && form.type === "preventive" && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Generation auto</h2>
              <label className="flex items-start gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={generateVisits} onChange={(e) => setGenerateVisits(e.target.checked)} className="mt-0.5" />
                <span>
                  <span style={{ color: "var(--text)" }}>Generer les visites planifiees</span>
                  <span className="block text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Une visite preventive sera creee tous les {form.frequencyMonths} mois jusqu&apos;a la fin du contrat.
                  </span>
                </span>
              </label>
            </section>
          )}

          {contractId && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Zone dangereuse</h2>
              {!confirmDelete ? (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer ce contrat
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text)" }}>Confirmer la suppression ?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={onDelete} disabled={pending} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                      Supprimer definitivement
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-1.5 text-xs" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </form>
  );
}
