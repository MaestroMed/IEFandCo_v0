"use client";

import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createZone, deleteZone, updateZone } from "./actions";

const formSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  region: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  cities: z.string().optional(),
  slaUrgence: z.string().min(1),
  slaStandard: z.string().min(1),
  hubs: z.string().optional(),
  kpisJson: z.string().optional(),
  testimonialJson: z.string().optional(),
  faqJson: z.string().optional(),
  centerLat: z.string().optional(),
  centerLng: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverMediaId: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ZoneFormProps {
  zoneId?: string;
  initial?: Partial<FormValues>;
}

export function ZoneForm({ zoneId, initial }: ZoneFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { register, handleSubmit, watch, setValue, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initial?.slug || "",
      name: initial?.name || "",
      code: initial?.code || "",
      region: initial?.region || "Île-de-France",
      tagline: initial?.tagline || "",
      intro: initial?.intro || "",
      cities: initial?.cities || "",
      slaUrgence: initial?.slaUrgence || "",
      slaStandard: initial?.slaStandard || "",
      hubs: initial?.hubs || "",
      kpisJson: initial?.kpisJson || "",
      testimonialJson: initial?.testimonialJson || "",
      faqJson: initial?.faqJson || "",
      centerLat: initial?.centerLat || "",
      centerLng: initial?.centerLng || "",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
      coverMediaId: initial?.coverMediaId || "",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx || "0",
    },
  });

  const name = watch("name");

  useEffect(() => {
    if (!slugDirty && name) setValue("slug", slugify(name));
  }, [name, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        slug: values.slug,
        name: values.name,
        code: values.code,
        region: values.region,
        tagline: values.tagline,
        intro: values.intro,
        cities: values.cities,
        slaUrgence: values.slaUrgence,
        slaStandard: values.slaStandard,
        hubs: values.hubs,
        kpisJson: values.kpisJson,
        testimonialJson: values.testimonialJson,
        faqJson: values.faqJson,
        centerLat: values.centerLat,
        centerLng: values.centerLng,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        coverMediaId: values.coverMediaId,
        visible: !!values.visible,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
      };
      const res = zoneId ? await updateZone(zoneId, payload) : await createZone(payload);
      if (res.ok) {
        toast.success(zoneId ? "Enregistre" : "Zone creee");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!zoneId && "id" in res && res.id) router.push(`/admin/content/zones/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function remove() {
    if (!zoneId) return;
    start(async () => {
      const res = await deleteZone(zoneId);
      if (res.ok) {
        toast.success("Supprime");
        router.push("/admin/content/zones");
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

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
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/admin/content/zones")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {zoneId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom</label>
                <input className={inputCls} style={inputStyle} {...register("name")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Slug</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} {...register("slug")} onChange={(e) => { setSlugDirty(true); setValue("slug", e.target.value); }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Code (75, 92, 93...)</label>
                <input className={inputCls} style={inputStyle} {...register("code")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Region</label>
                <input className={inputCls} style={inputStyle} {...register("region")} />
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tagline</label>
              <input className={inputCls} style={inputStyle} {...register("tagline")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Introduction</label>
              <textarea className={inputCls} style={inputStyle} rows={4} {...register("intro")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Couverture & SLA</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Villes (csv)</label>
              <textarea className={inputCls} style={inputStyle} rows={2} placeholder="Paris,Levallois,Neuilly" {...register("cities")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>SLA urgence</label>
                <input className={inputCls} style={inputStyle} placeholder="< 4h" {...register("slaUrgence")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>SLA standard</label>
                <input className={inputCls} style={inputStyle} placeholder="< 24h" {...register("slaStandard")} />
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Hubs (csv)</label>
              <input className={inputCls} style={inputStyle} {...register("hubs")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Latitude</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} {...register("centerLat")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Longitude</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} {...register("centerLng")} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Donnees structurees (JSON)</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>KPIs (JSON array)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={4} placeholder='[{"value":"4h","label":"SLA","sub":"depannage"}]' {...register("kpisJson")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Temoignage (JSON object)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={3} placeholder='{"author":"...","company":"...","quote":"..."}' {...register("testimonialJson")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>FAQ (JSON array)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={4} placeholder='[{"question":"...","answer":"..."}]' {...register("faqJson")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>SEO</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre SEO</label>
              <input className={inputCls} style={inputStyle} {...register("seoTitle")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description SEO</label>
              <textarea className={inputCls} style={inputStyle} rows={2} {...register("seoDescription")} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Publication</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("visible")} />
              <span className="text-sm" style={{ color: "var(--text)" }}>Visible</span>
            </label>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ordre</label>
              <input type="number" className={inputCls} style={inputStyle} {...register("orderIdx")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Couverture</h2>
            <Controller
              control={control}
              name="coverMediaId"
              render={({ field }) => (
                <MediaPicker value={field.value || null} onChange={(id) => field.onChange(id || "")} mimeFilter="image/" />
              )}
            />
          </section>
        </div>
      </div>

      {zoneId && (
        <section className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)" }}>Zone de danger</p>
          {confirming ? (
            <div className="flex items-center gap-2">
              <button type="button" disabled={pending} onClick={remove} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Confirmer la suppression</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>Annuler</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Trash2 className="h-3 w-3" /> Supprimer cette zone
            </button>
          )}
        </section>
      )}
    </form>
  );
}
