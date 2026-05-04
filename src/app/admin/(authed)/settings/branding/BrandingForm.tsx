"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { updateBranding } from "../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface Props {
  initial: {
    primaryColor: string;
    copperColor: string;
    faviconUrl: string;
    ogDefaultImage: string;
    logoDarkUrl: string;
    logoLightUrl: string;
    logoMediaId: string;
    logoLightMediaId: string;
    faviconMediaId: string;
    logoAlt: string;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function BrandingForm({ initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState(initial);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateBranding({
        "brand:primary-color": form.primaryColor,
        "brand:copper-color": form.copperColor,
        "brand:favicon-url": form.faviconUrl,
        "brand:og-default-image": form.ogDefaultImage,
        "brand:logo-dark-url": form.logoDarkUrl,
        "brand:logo-light-url": form.logoLightUrl,
        "brand:logo-media-id": form.logoMediaId,
        "brand:logo-light-media-id": form.logoLightMediaId,
        "brand:favicon-media-id": form.faviconMediaId,
        "brand:logo-alt": form.logoAlt,
      });
      if (res.ok) {
        toast.success("Marque mise a jour");
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Couleurs</h2>

            <ColorField
              label="Couleur primaire"
              value={form.primaryColor}
              onChange={(v) => update("primaryColor", v)}
            />
            <ColorField
              label="Couleur copper (accent)"
              value={form.copperColor}
              onChange={(v) => update("copperColor", v)}
            />
          </section>

          <section className="rounded-xl p-6 space-y-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Logo &amp; favicon</h2>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Choisissez via la bibliotheque media (recommande) ou collez une URL plus bas.
              </p>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Logo principal (theme sombre)</label>
              <MediaPicker
                value={form.logoMediaId || null}
                onChange={(id) => update("logoMediaId", id || "")}
                mimeFilter="image/"
                triggerLabel="Choisir le logo (theme sombre)"
              />
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Logo (theme clair) — optionnel</label>
              <MediaPicker
                value={form.logoLightMediaId || null}
                onChange={(id) => update("logoLightMediaId", id || "")}
                mimeFilter="image/"
                triggerLabel="Choisir le logo (theme clair)"
              />
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Favicon</label>
              <MediaPicker
                value={form.faviconMediaId || null}
                onChange={(id) => update("faviconMediaId", id || "")}
                mimeFilter="image/"
                triggerLabel="Choisir le favicon"
              />
              <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                Recommande : PNG carre 512x512 (Next.js sert automatiquement plusieurs tailles).
              </p>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Texte alternatif (alt) du logo</label>
              <input
                type="text"
                value={form.logoAlt}
                onChange={(e) => update("logoAlt", e.target.value)}
                placeholder="IEF & CO — Metallerie Serrurerie Ile-de-France"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>URL libres (avance)</h2>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Si un media est selectionne ci-dessus, son URL est utilisee en priorite. Ces champs sont une roue de secours.
              </p>
            </div>

            <UrlField
              label="Favicon (URL libre)"
              value={form.faviconUrl}
              onChange={(v) => update("faviconUrl", v)}
              placeholder="/favicon.ico"
            />
            <UrlField
              label="Image OG par defaut"
              value={form.ogDefaultImage}
              onChange={(v) => update("ogDefaultImage", v)}
              placeholder="/og-default.png"
            />
            <UrlField
              label="Logo theme sombre (URL libre)"
              value={form.logoDarkUrl}
              onChange={(v) => update("logoDarkUrl", v)}
              placeholder="/logo-dark.svg"
            />
            <UrlField
              label="Logo theme clair (URL libre)"
              value={form.logoLightUrl}
              onChange={(v) => update("logoLightUrl", v)}
              placeholder="/logo-light.svg"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Apercu</h2>

            <div className="rounded-lg p-4" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-4">
                {form.faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.faviconUrl} alt="favicon" className="h-6 w-6 rounded" />
                ) : (
                  <div className="h-6 w-6 rounded" style={{ background: form.primaryColor }} />
                )}
                <span className="font-display font-bold text-base" style={{ color: "var(--text)" }}>
                  IEF<span style={{ color: form.primaryColor }}>&amp;</span>CO
                </span>
              </div>

              <button
                type="button"
                className="w-full rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: form.primaryColor }}
              >
                Bouton primaire
              </button>

              <button
                type="button"
                className="mt-2 w-full rounded-lg px-5 py-2.5 text-sm font-semibold"
                style={{ background: "transparent", border: `1px solid ${form.copperColor}`, color: form.copperColor }}
              >
                Bouton accent
              </button>

              <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="font-mono uppercase tracking-wider" style={{ color: form.copperColor }}>
                  Note copper
                </span>
                <br />
                Apercu en direct des couleurs choisies.
              </p>
            </div>

            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Les changements de couleur seront appliques au prochain build (variables CSS construites au demarrage).
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls} style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 rounded-lg cursor-pointer"
          style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} font-mono`}
          style={inputStyle}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function UrlField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls} style={{ color: "var(--text-muted)", marginBottom: 0 }}>{label}</label>
        <Link href="/admin/media" className="text-[10px] hover:text-primary" style={{ color: "var(--color-copper)" }}>
          Parcourir dans /admin/media →
        </Link>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} font-mono`}
        style={inputStyle}
      />
    </div>
  );
}
