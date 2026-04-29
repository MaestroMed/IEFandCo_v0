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
import { createBrand, deleteBrand, updateBrand } from "./actions";

const formSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  productsJson: z.string().optional(),
  failuresJson: z.string().optional(),
  strengthsJson: z.string().optional(),
  faqJson: z.string().optional(),
  searchVolume: z.string().optional(),
  accentColor: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  logoMediaId: z.string().optional(),
  coverMediaId: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  brandId?: string;
  initial?: Partial<FormValues>;
}

export function BrandForm({ brandId, initial }: BrandFormProps) {
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
      tagline: initial?.tagline || "",
      intro: initial?.intro || "",
      productsJson: initial?.productsJson || "",
      failuresJson: initial?.failuresJson || "",
      strengthsJson: initial?.strengthsJson || "",
      faqJson: initial?.faqJson || "",
      searchVolume: initial?.searchVolume || "",
      accentColor: initial?.accentColor || "",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
      logoMediaId: initial?.logoMediaId || "",
      coverMediaId: initial?.coverMediaId || "",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx || "0",
    },
  });

  const name = watch("name");
  useEffect(() => { if (!slugDirty && name) setValue("slug", slugify(name)); }, [name, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        slug: values.slug,
        name: values.name,
        tagline: values.tagline,
        intro: values.intro,
        productsJson: values.productsJson,
        failuresJson: values.failuresJson,
        strengthsJson: values.strengthsJson,
        faqJson: values.faqJson,
        searchVolume: values.searchVolume,
        accentColor: values.accentColor,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        logoMediaId: values.logoMediaId,
        coverMediaId: values.coverMediaId,
        visible: !!values.visible,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
      };
      const res = brandId ? await updateBrand(brandId, payload) : await createBrand(payload);
      if (res.ok) {
        toast.success(brandId ? "Enregistre" : "Marque creee");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!brandId && "id" in res && res.id) router.push(`/admin/content/brands/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function remove() {
    if (!brandId) return;
    start(async () => {
      const res = await deleteBrand(brandId);
      if (res.ok) {
        toast.success("Supprime");
        router.push("/admin/content/brands");
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
          {pending ? (<><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>) : saved ? (<><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>) : (<span>Pret</span>)}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/admin/content/brands")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Annuler</button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {brandId ? "Enregistrer" : "Creer"}
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
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tagline</label>
              <input className={inputCls} style={inputStyle} {...register("tagline")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Introduction</label>
              <textarea className={inputCls} style={inputStyle} rows={4} {...register("intro")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Volume de recherche</label>
                <input className={inputCls} style={inputStyle} placeholder="14k searches/mois" {...register("searchVolume")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Couleur d&apos;accent (RGB)</label>
                <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="196, 133, 92" {...register("accentColor")} />
              </div>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Donnees structurees (JSON)</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Produits (JSON array de strings)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={3} placeholder='["SPU","SecuTec"]' {...register("productsJson")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Pannes courantes (JSON array)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={3} placeholder='["Capteur defaillant","..."]' {...register("failuresJson")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Forces (JSON array)</label>
              <textarea className={`${inputCls} font-mono`} style={inputStyle} rows={3} placeholder='["Robustesse","..."]' {...register("strengthsJson")} />
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
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Logo</h2>
            <Controller control={control} name="logoMediaId" render={({ field }) => (
              <MediaPicker value={field.value || null} onChange={(id) => field.onChange(id || "")} mimeFilter="image/" />
            )} />
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Couverture</h2>
            <Controller control={control} name="coverMediaId" render={({ field }) => (
              <MediaPicker value={field.value || null} onChange={(id) => field.onChange(id || "")} mimeFilter="image/" />
            )} />
          </section>
        </div>
      </div>

      {brandId && (
        <section className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)" }}>Zone de danger</p>
          {confirming ? (
            <div className="flex items-center gap-2">
              <button type="button" disabled={pending} onClick={remove} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Confirmer la suppression</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>Annuler</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Trash2 className="h-3 w-3" /> Supprimer cette marque
            </button>
          )}
        </section>
      )}
    </form>
  );
}
