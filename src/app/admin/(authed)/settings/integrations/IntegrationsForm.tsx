"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BarChart, Loader2, Mail, MapPin } from "lucide-react";
import { updateIntegrations } from "../actions";

interface Props {
  envResendSet: boolean;
  initial: {
    resendKey: string;
    mapsEmbed: string;
    vercelAnalytics: boolean;
    plausibleDomain: string;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function IntegrationsForm({ envResendSet, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState(initial);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateIntegrations({
        "int:resend-api-key": form.resendKey,
        "int:maps-embed": form.mapsEmbed,
        "int:vercel-analytics": form.vercelAnalytics,
        "int:plausible-domain": form.plausibleDomain,
      });
      if (res.ok) {
        toast.success("Integrations enregistrees");
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

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0" style={{ background: "var(--bg-muted)" }}>
            <Mail className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Resend</h3>
              <StatusPill ok={envResendSet || !!form.resendKey} label={envResendSet ? "ENV" : form.resendKey ? "DB" : "Non configure"} />
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Service d&apos;envoi d&apos;emails transactionnels. La variable d&apos;environnement <code className="font-mono">RESEND_API_KEY</code> a la priorite sur la valeur stockee.
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>API key Resend (fallback)</label>
          <input
            type="password"
            className={`${inputCls} font-mono`}
            style={inputStyle}
            value={form.resendKey}
            onChange={(e) => update("resendKey", e.target.value)}
            placeholder="re_..."
          />
          {envResendSet && (
            <p className="mt-1 text-[11px]" style={{ color: "var(--color-copper)" }}>
              ⚠ La variable <code className="font-mono">RESEND_API_KEY</code> est definie. Elle sera utilisee en priorite.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0" style={{ background: "var(--bg-muted)" }}>
            <MapPin className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Google Maps</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Code embed iframe pour la carte du site contact. Coller le code complet depuis Google Maps.
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Embed code (iframe complet)</label>
          <textarea
            rows={4}
            className={`${inputCls} font-mono text-xs`}
            style={inputStyle}
            value={form.mapsEmbed}
            onChange={(e) => update("mapsEmbed", e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed?..." />'
          />
        </div>
      </section>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0" style={{ background: "var(--bg-muted)" }}>
            <BarChart className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Analytics</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Choisissez Vercel Analytics (intégré au deploy) et/ou Plausible (privacy-first, externe).
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.vercelAnalytics}
            onChange={(e) => update("vercelAnalytics", e.target.checked)}
          />
          <span className="text-sm" style={{ color: "var(--text)" }}>Activer Vercel Analytics</span>
        </label>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Domaine Plausible</label>
          <input
            type="text"
            className={`${inputCls} font-mono`}
            style={inputStyle}
            value={form.plausibleDomain}
            onChange={(e) => update("plausibleDomain", e.target.value)}
            placeholder="iefandco.com"
          />
        </div>
      </section>
    </form>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
      style={{
        background: ok ? "rgba(60,170,140,0.15)" : "var(--bg-muted)",
        color: ok ? "#3CAA8C" : "var(--text-muted)",
      }}
    >
      {label}
    </span>
  );
}
