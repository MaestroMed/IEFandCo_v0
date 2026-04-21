"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { createSite, updateSite, deleteSite } from "../actions";

interface SiteFormProps {
  siteId?: string;
  initial?: {
    clientName?: string;
    label?: string | null;
    address?: string;
    city?: string | null;
    postalCode?: string | null;
    accessInstructions?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    notes?: string | null;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function SiteForm({ siteId, initial }: SiteFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    clientName: initial?.clientName || "",
    label: initial?.label || "",
    address: initial?.address || "",
    city: initial?.city || "",
    postalCode: initial?.postalCode || "",
    accessInstructions: initial?.accessInstructions || "",
    contactName: initial?.contactName || "",
    contactEmail: initial?.contactEmail || "",
    contactPhone: initial?.contactPhone || "",
    notes: initial?.notes || "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.address.trim()) {
      toast.error("Client et adresse requis");
      return;
    }
    start(async () => {
      const payload = {
        clientName: form.clientName.trim(),
        label: form.label || null,
        address: form.address.trim(),
        city: form.city || null,
        postalCode: form.postalCode || null,
        accessInstructions: form.accessInstructions || null,
        contactName: form.contactName || null,
        contactEmail: form.contactEmail || null,
        contactPhone: form.contactPhone || null,
        notes: form.notes || null,
      };
      const res = siteId ? await updateSite(siteId, payload) : await createSite(payload);
      if (res.ok) {
        toast.success(siteId ? "Site mis a jour" : "Site cree");
        if (!siteId && "id" in res) router.push(`/admin/maintenance/sites/${res.id}`);
        else router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete() {
    if (!siteId) return;
    start(async () => {
      const res = await deleteSite(siteId);
      if (res.ok) {
        toast.success("Site supprime");
        router.push("/admin/maintenance/sites");
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
            onClick={() => router.push("/admin/maintenance/sites")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {siteId ? "Enregistrer" : "Creer le site"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
              Client &amp; site
            </h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Client</label>
              <input className={inputCls} style={inputStyle} value={form.clientName} onChange={(e) => update("clientName", e.target.value)} placeholder="Logistique Roissy SAS" />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Libelle du site</label>
              <input className={inputCls} style={inputStyle} value={form.label} onChange={(e) => update("label", e.target.value)} placeholder="Siege Bercy / Entrepot Aulnay" />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Adresse</label>
              <input className={inputCls} style={inputStyle} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="12 rue de l'Industrie" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ville</label>
                <input className={inputCls} style={inputStyle} value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Code postal</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Instructions d&apos;acces</label>
              <textarea className={inputCls} style={inputStyle} rows={3} value={form.accessInstructions} onChange={(e) => update("accessInstructions", e.target.value)} placeholder="Code badge, contacts gardiennage, horaires d'acces..." />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Notes internes</h2>
            <textarea className={inputCls} style={inputStyle} rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Contact site</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom</label>
              <input className={inputCls} style={inputStyle} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Email</label>
              <input type="email" className={inputCls} style={inputStyle} value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Telephone</label>
              <input className={`${inputCls} font-mono`} style={inputStyle} value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
            </div>
          </section>

          {siteId && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Zone dangereuse</h2>
              {!confirmDelete ? (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer ce site
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text)" }}>
                    Confirmer la suppression ? Equipements, contrats et visites seront aussi supprimes.
                  </p>
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
