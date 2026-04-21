"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createVisit } from "../actions";
import { VISIT_STATUSES, VISIT_TYPES, VISIT_STATUS_LABELS, VISIT_TYPE_LABELS } from "../constants";

interface SiteOption {
  id: string;
  clientName: string;
  label: string | null;
}
interface EquipmentOption {
  id: string;
  siteId: string;
  type: string;
  label: string | null;
}
interface TechnicianOption {
  id: string;
  name: string;
  role: string;
}

interface VisitFormProps {
  sites: SiteOption[];
  equipment: EquipmentOption[];
  technicians: TechnicianOption[];
  initial?: {
    siteId?: string | null;
    equipmentId?: string | null;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

function defaultDateTime() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 24);
  // YYYY-MM-DDTHH:mm
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function VisitForm({ sites, equipment, technicians, initial }: VisitFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    siteId: initial?.siteId || (sites[0]?.id ?? ""),
    equipmentId: initial?.equipmentId || "",
    scheduledFor: defaultDateTime(),
    type: VISIT_TYPES[0] as "preventive" | "curative" | "audit",
    status: "scheduled" as "scheduled" | "in_progress" | "done" | "cancelled",
    technicianId: "",
    durationMinutes: "",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // When site changes, clear equipment if it doesn't belong to that site
  useEffect(() => {
    if (form.equipmentId) {
      const eq = equipment.find((e) => e.id === form.equipmentId);
      if (eq && form.siteId && eq.siteId !== form.siteId) {
        setForm((f) => ({ ...f, equipmentId: "" }));
      }
    }
  }, [form.siteId, form.equipmentId, equipment]);

  const filteredEquipment = useMemo(() => {
    if (!form.siteId) return equipment;
    return equipment.filter((e) => e.siteId === form.siteId);
  }, [equipment, form.siteId]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.scheduledFor) {
      toast.error("Date requise");
      return;
    }
    start(async () => {
      const payload = {
        siteId: form.siteId || null,
        equipmentId: form.equipmentId || null,
        scheduledFor: new Date(form.scheduledFor).getTime(),
        type: form.type,
        status: form.status,
        technicianId: form.technicianId || null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        notes: form.notes || null,
      };
      const res = await createVisit(payload);
      if (res.ok) {
        toast.success("Visite programmee");
        router.push("/admin/maintenance/visits");
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
            onClick={() => router.push("/admin/maintenance/visits")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            Programmer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Quoi &amp; ou</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Site</label>
                <select className={inputCls} style={inputStyle} value={form.siteId} onChange={(e) => update("siteId", e.target.value)}>
                  <option value="">— Aucun site —</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.clientName} {s.label ? `— ${s.label}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Equipement</label>
                <select className={inputCls} style={inputStyle} value={form.equipmentId} onChange={(e) => update("equipmentId", e.target.value)}>
                  <option value="">— Tout le site —</option>
                  {filteredEquipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.label || eq.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Date / heure</label>
                <input type="datetime-local" className={`${inputCls} font-mono`} style={inputStyle} value={form.scheduledFor} onChange={(e) => update("scheduledFor", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Type</label>
                <select className={inputCls} style={inputStyle} value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {VISIT_TYPES.map((t) => (
                    <option key={t} value={t}>{VISIT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Notes preparatoires</h2>
            <textarea className={inputCls} style={inputStyle} rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Materiel necessaire, points particuliers, contacts sur place..." />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Affectation</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Technicien</label>
              <select className={inputCls} style={inputStyle} value={form.technicianId} onChange={(e) => update("technicianId", e.target.value)}>
                <option value="">— Non assigne —</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status initial</label>
              <select className={inputCls} style={inputStyle} value={form.status} onChange={(e) => update("status", e.target.value)}>
                {VISIT_STATUSES.map((s) => (
                  <option key={s} value={s}>{VISIT_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Duree estimee (min)</label>
              <input type="number" min={0} className={`${inputCls} font-mono`} style={inputStyle} value={form.durationMinutes} onChange={(e) => update("durationMinutes", e.target.value)} />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
