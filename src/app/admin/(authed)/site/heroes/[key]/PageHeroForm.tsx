"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { MediaPicker } from "@/components/admin/MediaPicker";

const formSchema = z.object({
  enabled: z.boolean().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  intro: z.string().optional(),
  mediaId: z.string().optional(),
  objectPosition: z.string().optional(),
  opacity: z.string().optional(),
  overlayLeft: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PageHeroFormProps {
  pageKey: string;
  pageLabel: string;
  pagePath: string;
  existing: boolean;
  initial?: Partial<FormValues>;
  initialMedia?: { mediaUrl: string | null; mediaMime: string | null };
}

export function PageHeroForm({
  pageKey,
  pageLabel,
  pagePath,
  existing,
  initial,
  initialMedia,
}: PageHeroFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [resetting, startReset] = useTransition();
  const [saved, setSaved] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string | null; mime: string | null }>({
    url: initialMedia?.mediaUrl || null,
    mime: initialMedia?.mediaMime || null,
  });

  const { register, handleSubmit, watch, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: initial?.enabled ?? true,
      eyebrow: initial?.eyebrow || "",
      title: initial?.title || "",
      intro: initial?.intro || "",
      mediaId: initial?.mediaId || "",
      objectPosition: initial?.objectPosition || "center 50%",
      opacity: initial?.opacity || "100",
      overlayLeft: initial?.overlayLeft || "70",
    },
  });

  const opacity = watch("opacity");
  const overlayLeft = watch("overlayLeft");
  const title = watch("title");
  const eyebrow = watch("eyebrow");
  const intro = watch("intro");
  const mediaId = watch("mediaId");
  const objectPosition = watch("objectPosition");

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
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mediaId]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      try {
        const res = await fetch("/api/admin/site/heroes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: pageKey,
            enabled: !!values.enabled,
            eyebrow: values.eyebrow || null,
            title: values.title || null,
            intro: values.intro || null,
            mediaId: values.mediaId || null,
            objectPosition: values.objectPosition || "center 50%",
            opacity: values.opacity ? Number(values.opacity) : 100,
            overlayLeft: values.overlayLeft ? Number(values.overlayLeft) : 70,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          toast.success("Hero enregistre");
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          router.refresh();
        } else {
          toast.error(data.error || "Erreur");
        }
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  function handleReset() {
    if (!existing) return;
    if (!confirm("Reinitialiser ce hero aux defauts ? La row en base sera supprimee.")) return;
    startReset(async () => {
      try {
        const res = await fetch("/api/admin/site/heroes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: pageKey }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          toast.success("Reinitialise");
          router.push("/admin/site/heroes");
          router.refresh();
        } else {
          toast.error(data.error || "Erreur");
        }
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls =
    "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  const opacityPct = Number(opacity || 100);
  const overlayPct = Number(overlayLeft || 70);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...
            </>
          ) : saved ? (
            <>
              <Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre
            </>
          ) : (
            <span>Pret — {pageLabel} ({pagePath})</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {existing && (
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting || pending}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs disabled:opacity-50"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              title="Supprime la row en base et restaure le hero code par defaut"
            >
              {resetting ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
              Reinitialiser au defaut
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section
            className="rounded-xl p-6 space-y-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                Activation
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("enabled")} />
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  Activer cette surcharge
                </span>
              </label>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Quand desactive, la page utilise son hero code par defaut.
            </p>
          </section>

          <section
            className="rounded-xl p-6 space-y-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
              Texte
            </h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Eyebrow
              </label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="Ex : Notre savoir-faire"
                {...register("eyebrow")}
              />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Titre (multiligne autorise)
              </label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("title")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Intro / sous-titre
              </label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("intro")} />
            </div>
          </section>

          <section
            className="rounded-xl p-6 space-y-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
              Media de fond
            </h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Image (recommandee) ou video
              </label>
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
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Object-position (CSS) — defaut &quot;center 50%&quot;
              </label>
              <input
                className={`${inputCls} font-mono`}
                style={inputStyle}
                placeholder="center 50%"
                {...register("objectPosition")}
              />
              <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                Ex : &quot;center top&quot;, &quot;left bottom&quot;, &quot;30% 80%&quot;
              </p>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Opacite image — {opacityPct}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={opacity || "100"}
                onChange={(e) => setValue("opacity", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>
                Voile sombre cote gauche — {overlayPct}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={overlayLeft || "70"}
                onChange={(e) => setValue("overlayLeft", e.target.value)}
                className="w-full"
              />
              <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                Renforce la lisibilite du texte (gradient noir → transparent).
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section
            className="rounded-xl p-6 space-y-3"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
              Apercu
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Apercu approximatif du rendu sur la page.
            </p>
            <div
              className="relative aspect-video rounded-lg overflow-hidden"
              style={{ background: "var(--bg-muted)" }}
            >
              {previewMedia.url ? (
                previewMedia.mime?.startsWith("video/") ? (
                  <video
                    src={previewMedia.url}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: objectPosition || "center 50%",
                      opacity: opacityPct / 100,
                    }}
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
                    style={{
                      objectPosition: objectPosition || "center 50%",
                      opacity: opacityPct / 100,
                    }}
                  />
                )
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Aucun media selectionne
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, rgba(0,0,0,${overlayPct / 100}) 0%, rgba(0,0,0,0) 100%)`,
                }}
              />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 text-white">
                {eyebrow && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-90">
                    {eyebrow}
                  </span>
                )}
                {title && (
                  <h3 className="mt-1 font-display text-base font-bold leading-tight whitespace-pre-line drop-shadow">
                    {title}
                  </h3>
                )}
                {intro && (
                  <p className="mt-1 text-[11px] opacity-90 whitespace-pre-line drop-shadow line-clamp-3">
                    {intro}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section
            className="rounded-xl p-5 space-y-2 text-xs"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text)" }}>
              Cle technique
            </h3>
            <p className="font-mono" style={{ color: "var(--color-copper)" }}>
              {pageKey}
            </p>
            <p>
              Utilisable cote serveur via <code className="font-mono">getPageHero(&quot;{pageKey}&quot;)</code>.
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
