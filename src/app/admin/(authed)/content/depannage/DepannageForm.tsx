"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { createDepannageService, deleteDepannageService, updateDepannageService } from "./actions";

const formSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  businessImpact: z.string().min(1),
  accentColor: z.string().min(1),
  brands: z.string().optional(),
  failuresJson: z.string().optional(),
  partsInStock: z.string().optional(),
  relatedServices: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DepannageFormProps {
  serviceId?: string;
  initial?: Partial<FormValues>;
}

export function DepannageForm({ serviceId, initial }: DepannageFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initial?.slug || "",
      label: initial?.label || "",
      tagline: initial?.tagline || "",
      intro: initial?.intro || "",
      businessImpact: initial?.businessImpact || "",
      accentColor: initial?.accentColor || "196, 133, 92",
      brands: initial?.brands || "",
      failuresJson: initial?.failuresJson || "",
      partsInStock: initial?.partsInStock || "",
      relatedServices: initial?.relatedServices || "",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx || "0",
    },
  });

  const label = watch("label");
  useEffect(() => { if (!slugDirty && label) setValue("slug", slugify(label)); }, [label, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        slug: values.slug,
        label: values.label,
        tagline: values.tagline,
        intro: values.intro,
        businessImpact: values.businessImpact,
        accentColor: values.accentColor,
        brands: values.brands,
        failuresJson: values.failuresJson,
        partsInStock: values.partsInStock,
        relatedServices: values.relatedServices,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        visible: !!values.visible,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
      };
      const res = serviceId ? await updateDepannageService(serviceId, payload) : await createDepannageService(payload);
      if (res.ok) {
        toast.success(serviceId ? "Enregistre" : "Service cree");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!serviceId && "id" in res && res.id) router.push(`/admin/content/depannage/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function remove() {
    if (!serviceId) return;
    start(async () => {
      const res = await deleteDepannageService(serviceId);
      if (res.ok) { toast.success("Supprime"); router.push("/admin/content/depannage"); }
      else toast.error(res.error || "Erreur");
    });
  }

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (<><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>) : saved ? (<><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>) : (<span>Pret</span>)}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/admin/content/depannage")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Annuler</button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{serviceId ? "Enregistrer" : "Creer"}</button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Label</label>
            <input className={inputCls} style={inputStyle} {...register("label")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Slug</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} {...register("slug")} onChange={(e) => { setSlugDirty(true); setValue("slug", e.target.value); }} />
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
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Impact business</label>
          <textarea className={inputCls} style={inputStyle} rows={3} {...register("businessImpact")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Couleur d&apos;accent (RGB)</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="196, 133, 92" {...register("accentColor")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ordre</label>
            <input type="number" className={inputCls} style={inputStyle} {...register("orderIdx")} />
          </div>
        </div>
      </section>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Listes & donnees</h2>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Marques supportees (csv)</label>
          <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="Hormann,Crawford,Maviflex" {...register("brands")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Pieces en stock (csv)</label>
          <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="ressort,carte electronique,..." {...register("partsInStock")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Services lies (slugs csv)</label>
          <input className={`${inputCls} font-mono`} style={inputStyle} {...register("relatedServices")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Pannes (JSON array)</label>
          <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={5} placeholder='[{"title":"...","symptom":"...","fix":"...","avgDuration":"45min"}]' {...register("failuresJson")} />
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
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("visible")} />
          <span className="text-sm" style={{ color: "var(--text)" }}>Visible</span>
        </label>
      </section>

      {serviceId && (
        <section className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)" }}>Zone de danger</p>
          {confirming ? (
            <div className="flex items-center gap-2">
              <button type="button" disabled={pending} onClick={remove} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Confirmer la suppression</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>Annuler</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Trash2 className="h-3 w-3" /> Supprimer ce service
            </button>
          )}
        </section>
      )}
    </form>
  );
}
