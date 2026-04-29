"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveHero } from "./actions";

const formSchema = z.object({
  enabled: z.boolean().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryHref: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryHref: z.string().optional(),
  mediaId: z.string().optional(),
  posterMediaId: z.string().optional(),
  overlayOpacity: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HeroFormProps {
  initial?: Partial<FormValues>;
  initialMedia?: { mediaUrl: string | null; mediaMime: string | null; posterUrl: string | null };
}

export function HeroForm({ initial, initialMedia }: HeroFormProps) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string | null; mime: string | null }>({
    url: initialMedia?.mediaUrl || null,
    mime: initialMedia?.mediaMime || null,
  });
  const [previewPoster, setPreviewPoster] = useState<string | null>(initialMedia?.posterUrl || null);

  const { register, handleSubmit, watch, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: initial?.enabled ?? false,
      eyebrow: initial?.eyebrow || "",
      title: initial?.title || "",
      subtitle: initial?.subtitle || "",
      ctaPrimaryLabel: initial?.ctaPrimaryLabel || "",
      ctaPrimaryHref: initial?.ctaPrimaryHref || "",
      ctaSecondaryLabel: initial?.ctaSecondaryLabel || "",
      ctaSecondaryHref: initial?.ctaSecondaryHref || "",
      mediaId: initial?.mediaId || "",
      posterMediaId: initial?.posterMediaId || "",
      overlayOpacity: initial?.overlayOpacity || "50",
    },
  });

  const overlay = watch("overlayOpacity");
  const title = watch("title");
  const eyebrow = watch("eyebrow");
  const subtitle = watch("subtitle");
  const mediaId = watch("mediaId");
  const posterMediaId = watch("posterMediaId");

  // Fetch preview media URL when mediaId changes
  useEffect(() => {
    if (!mediaId) {
      setPreviewMedia({ url: null, mime: null });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/media/list?id=${encodeURIComponent(mediaId)}`);
        if (!r.ok) return;
        const d = await r.json();
        if (!cancelled && d.items?.[0]) {
          setPreviewMedia({ url: d.items[0].url, mime: d.items[0].mime });
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [mediaId]);

  useEffect(() => {
    if (!posterMediaId) {
      setPreviewPoster(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/media/list?id=${encodeURIComponent(posterMediaId)}`);
        if (!r.ok) return;
        const d = await r.json();
        if (!cancelled && d.items?.[0]) setPreviewPoster(d.items[0].url);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [posterMediaId]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const res = await saveHero({
        enabled: !!values.enabled,
        eyebrow: values.eyebrow,
        title: values.title,
        subtitle: values.subtitle,
        ctaPrimaryLabel: values.ctaPrimaryLabel,
        ctaPrimaryHref: values.ctaPrimaryHref,
        ctaSecondaryLabel: values.ctaSecondaryLabel,
        ctaSecondaryHref: values.ctaSecondaryHref,
        mediaId: values.mediaId,
        posterMediaId: values.posterMediaId,
        overlayOpacity: values.overlayOpacity ? Number(values.overlayOpacity) : 50,
      });
      if (res.ok) {
        toast.success("Hero enregistre");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  const overlayPct = Number(overlay || 50);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>
          ) : saved ? (
            <><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>
          ) : (
            <span>Pret</span>
          )}
        </div>
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
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                Activation
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("enabled")} />
                <span className="text-sm" style={{ color: "var(--text)" }}>Activer ce hero</span>
              </label>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Quand desactive, la home utilise son hero code par defaut.
            </p>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Texte</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Eyebrow</label>
              <input className={inputCls} style={inputStyle} placeholder="Bureau d'etude — Atelier — Pose" {...register("eyebrow")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre (multiligne autorise)</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("title")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Sous-titre</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("subtitle")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>CTA</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Primaire — Label</label>
                <input className={inputCls} style={inputStyle} {...register("ctaPrimaryLabel")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Primaire — Lien</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="/devis" {...register("ctaPrimaryHref")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Secondaire — Label</label>
                <input className={inputCls} style={inputStyle} {...register("ctaSecondaryLabel")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Secondaire — Lien</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="/services" {...register("ctaSecondaryHref")} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Media de fond</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Image ou video</label>
              <Controller
                control={control}
                name="mediaId"
                render={({ field }) => (
                  <MediaPicker
                    value={field.value || null}
                    onChange={(id) => field.onChange(id || "")}
                    mimeFilter={["image/", "video/"]}
                  />
                )}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Poster (image affichee avant lecture video)</label>
              <Controller
                control={control}
                name="posterMediaId"
                render={({ field }) => (
                  <MediaPicker
                    value={field.value || null}
                    onChange={(id) => field.onChange(id || "")}
                    mimeFilter="image/"
                  />
                )}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Opacite voile sombre — {overlayPct}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={overlay || "50"}
                onChange={(e) => setValue("overlayOpacity", e.target.value)}
                className="w-full"
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Apercu</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Apercu approximatif du rendu sur la home.
            </p>
            <div
              className="relative aspect-video rounded-lg overflow-hidden"
              style={{ background: "var(--bg-muted)" }}
            >
              {previewMedia.url ? (
                previewMedia.mime?.startsWith("video/") ? (
                  <video
                    src={previewMedia.url}
                    poster={previewPoster || undefined}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewMedia.url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
                  Aucun media selectionne
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{ background: `rgba(0,0,0,${overlayPct / 100})` }}
              />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 text-white">
                {eyebrow && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-90">{eyebrow}</span>
                )}
                {title && (
                  <h3 className="mt-1 font-display text-base font-bold leading-tight whitespace-pre-line drop-shadow">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-[11px] opacity-90 whitespace-pre-line drop-shadow line-clamp-3">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
