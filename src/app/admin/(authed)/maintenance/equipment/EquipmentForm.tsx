"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { createEquipment, updateEquipment, deleteEquipment } from "../actions";
import { EQUIPMENT_STATUSES, EQUIPMENT_TYPES, EQUIPMENT_STATUS_LABELS } from "../constants";

interface SiteOption {
  id: string;
  clientName: string;
  label: string | null;
}

interface EquipmentFormProps {
  equipmentId?: string;
  sites: SiteOption[];
  initial?: {
    siteId?: string;
    type?: string;
    brand?: string | null;
    model?: string | null;
    serial?: string | null;
    installDate?: Date | null;
    warrantyEnd?: Date | null;
    label?: string | null;
    location?: string | null;
    notes?: string | null;
    status?: "active" | "faulty" | "retired";
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

function dateToInput(d?: Date | null) {
  if (!d) return "";
  const dd = new Date(d);
  return dd.toISOString().slice(0, 10);
}

export function EquipmentForm({ equipmentId, sites, initial }: EquipmentFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    siteId: initial?.siteId || (sites[0]?.id ?? ""),
    type: initial?.type || EQUIPMENT_TYPES[0],
    brand: initial?.brand || "",
    model: initial?.model || "",
    serial: initial?.serial || "",
    installDate: dateToInput(initial?.installDate),
    warrantyEnd: dateToInput(initial?.warrantyEnd),
    label: initial?.label || "",
    location: initial?.location || "",
    notes: initial?.notes || "",
    status: (initial?.status || "active") as "active" | "faulty" | "retired",
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
    start(async () => {
      const payload = {
        siteId: form.siteId,
        type: form.type,
        brand: form.brand || null,
        model: form.model || null,
        serial: form.serial || null,
        installDate: form.installDate ? new Date(form.installDate).getTime() : null,
        warrantyEnd: form.warrantyEnd ? new Date(form.warrantyEnd).getTime() : null,
        label: form.label || null,
        location: form.location || null,
        notes: form.notes || null,
        status: form.status,
      };
      const res = equipmentId ? await updateEquipment(equipmentId, payload) : await createEquipment(payload);
      if (res.ok) {
        toast.success(equipmentId ? "Equipement mis a jour" : "Equipement cree");
        if (!equipmentId && "id" in res) router.push(`/admin/maintenance/equipment/${res.id}`);
        else router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete() {
    if (!equipmentId) return;
    start(async () => {
      const res = await deleteEquipment(equipmentId);
      if (res.ok) {
        toast.success("Equipement supprime");
        router.push("/admin/maintenance/equipment");
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
            onClick={() => router.push("/admin/maintenance/equipment")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {equipmentId ? "Enregistrer" : "Creer l'equipement"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>
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
                  {EQUIPMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Libelle</label>
                <input className={inputCls} style={inputStyle} value={form.label} onChange={(e) => update("label", e.target.value)} placeholder="Porte quai 1" />
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Localisation</label>
              <input className={inputCls} style={inputStyle} value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Acces livraison nord" />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Specifications</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Marque</label>
                <input className={inputCls} style={inputStyle} value={form.brand} onChange={(e) => update("brand", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Modele</label>
                <input className={inputCls} style={inputStyle} value={form.model} onChange={(e) => update("model", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>N° serie</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} value={form.serial} onChange={(e) => update("serial", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Date de pose</label>
                <input type="date" className={`${inputCls} font-mono`} style={inputStyle} value={form.installDate} onChange={(e) => update("installDate", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Fin garantie</label>
                <input type="date" className={`${inputCls} font-mono`} style={inputStyle} value={form.warrantyEnd} onChange={(e) => update("warrantyEnd", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Notes</h2>
            <textarea className={inputCls} style={inputStyle} rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Status</h2>
            <div className="space-y-2">
              {EQUIPMENT_STATUSES.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={form.status === s} onChange={() => update("status", s)} />
                  <span style={{ color: form.status === s ? "var(--text)" : "var(--text-muted)", fontWeight: form.status === s ? 600 : 400 }}>
                    {EQUIPMENT_STATUS_LABELS[s]}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {equipmentId && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Zone dangereuse</h2>
              {!confirmDelete ? (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer cet equipement
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text)" }}>Confirmer la suppression ? Visites associees seront supprimees.</p>
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
