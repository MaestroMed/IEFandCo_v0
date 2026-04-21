"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateGeneral } from "../actions";

interface Props {
  initial: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    siren: string;
    rcs: string;
    president: string;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function GeneralForm({ initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState(initial);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateGeneral({
        "site:name": form.name,
        "site:tagline": form.tagline,
        "site:phone": form.phone,
        "site:email": form.email,
        "site:address": form.address,
        "site:hours": form.hours,
        "site:siren": form.siren,
        "site:rcs": form.rcs,
        "site:president": form.president,
      });
      if (res.ok) {
        toast.success("Parametres enregistres");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</span>}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>

          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom du site</label>
            <input className={inputCls} style={inputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tagline</label>
            <input className={inputCls} style={inputStyle} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
        </section>

        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Contact</h2>

          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Telephone</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Email</label>
            <input type="email" className={inputCls} style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Adresse</label>
            <input className={inputCls} style={inputStyle} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Horaires</label>
            <input className={inputCls} style={inputStyle} value={form.hours} onChange={(e) => update("hours", e.target.value)} />
          </div>
        </section>

        <section className="rounded-xl p-6 space-y-4 lg:col-span-2" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Mentions legales</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>SIREN</label>
              <input className={`${inputCls} font-mono`} style={inputStyle} value={form.siren} onChange={(e) => update("siren", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>RCS</label>
              <input className={inputCls} style={inputStyle} value={form.rcs} onChange={(e) => update("rcs", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>President</label>
              <input className={inputCls} style={inputStyle} value={form.president} onChange={(e) => update("president", e.target.value)} />
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
