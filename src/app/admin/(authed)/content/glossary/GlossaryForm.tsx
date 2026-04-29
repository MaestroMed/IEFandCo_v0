"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { createGlossaryTerm, deleteGlossaryTerm, updateGlossaryTerm, GLOSSARY_CATEGORIES } from "./actions";

const formSchema = z.object({
  slug: z.string().min(1),
  term: z.string().min(2),
  category: z.enum(GLOSSARY_CATEGORIES),
  shortDef: z.string().min(1),
  fullDef: z.string().min(1),
  relatedSlugs: z.string().optional(),
  relatedServices: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GlossaryFormProps {
  termId?: string;
  initial?: Partial<FormValues>;
}

export function GlossaryForm({ termId, initial }: GlossaryFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initial?.slug || "",
      term: initial?.term || "",
      category: (initial?.category as FormValues["category"]) || "Technique",
      shortDef: initial?.shortDef || "",
      fullDef: initial?.fullDef || "",
      relatedSlugs: initial?.relatedSlugs || "",
      relatedServices: initial?.relatedServices || "",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx || "0",
    },
  });

  const term = watch("term");

  useEffect(() => {
    if (!slugDirty && term) setValue("slug", slugify(term));
  }, [term, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        slug: values.slug,
        term: values.term,
        category: values.category,
        shortDef: values.shortDef,
        fullDef: values.fullDef,
        relatedSlugs: values.relatedSlugs,
        relatedServices: values.relatedServices,
        visible: !!values.visible,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
      };
      const res = termId ? await updateGlossaryTerm(termId, payload) : await createGlossaryTerm(payload);
      if (res.ok) {
        toast.success(termId ? "Enregistre" : "Terme cree");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!termId && "id" in res && res.id) router.push(`/admin/content/glossary/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function remove() {
    if (!termId) return;
    start(async () => {
      const res = await deleteGlossaryTerm(termId);
      if (res.ok) {
        toast.success("Supprime");
        router.push("/admin/content/glossary");
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
          <button
            type="button"
            onClick={() => router.push("/admin/content/glossary")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {termId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Terme</label>
            <input className={inputCls} style={inputStyle} {...register("term")} />
            {errors.term && <p className="mt-1 text-xs text-red-500">{errors.term.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Slug</label>
            <input
              className={`${inputCls} font-mono`}
              style={inputStyle}
              {...register("slug")}
              onChange={(e) => { setSlugDirty(true); setValue("slug", e.target.value); }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categorie</label>
            <select className={inputCls} style={inputStyle} {...register("category")}>
              {GLOSSARY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ordre</label>
            <input type="number" className={inputCls} style={inputStyle} {...register("orderIdx")} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("visible")} />
              <span className="text-sm" style={{ color: "var(--text)" }}>Visible</span>
            </label>
          </div>
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Definition courte</label>
          <textarea className={inputCls} style={inputStyle} rows={2} {...register("shortDef")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Definition complete</label>
          <textarea className={inputCls} style={inputStyle} rows={6} {...register("fullDef")} />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>Markdown autorise.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Termes lies (slugs csv)</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="en-1090,en-13241" {...register("relatedSlugs")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Services lies (slugs csv)</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="fermetures-industrielles,structures-metalliques" {...register("relatedServices")} />
          </div>
        </div>
      </section>

      {termId && (
        <section className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text)" }}>Zone de danger</p>
          {confirming ? (
            <div className="flex items-center gap-2">
              <button type="button" disabled={pending} onClick={remove} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Confirmer la suppression</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>Annuler</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Trash2 className="h-3 w-3" /> Supprimer ce terme
            </button>
          )}
        </section>
      )}
    </form>
  );
}
