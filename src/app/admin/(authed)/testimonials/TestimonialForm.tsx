"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { StarRating } from "@/components/admin/StarRating";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createTestimonial, updateTestimonial } from "./actions";

const schema = z.object({
  author: z.string().min(2, "Auteur requis"),
  company: z.string().optional(),
  quote: z.string().min(5, "Citation requise"),
  rating: z.number().min(1).max(5),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
  photoMediaId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TestimonialFormProps {
  testimonialId?: string;
  initial?: Partial<FormValues>;
}

export function TestimonialForm({ testimonialId, initial }: TestimonialFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      author: initial?.author || "",
      company: initial?.company || "",
      quote: initial?.quote || "",
      rating: (initial?.rating as number) ?? 5,
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx !== undefined && initial?.orderIdx !== null ? String(initial.orderIdx) : "0",
      photoMediaId: initial?.photoMediaId || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        ...values,
        rating: Number(values.rating),
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
        visible: !!values.visible,
        photoMediaId: values.photoMediaId || null,
      };
      const res = testimonialId ? await updateTestimonial(testimonialId, payload) : await createTestimonial(payload);
      if (res.ok) {
        toast.success(testimonialId ? "Enregistre" : "Temoignage ajoute");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!testimonialId && "id" in res && res.id) router.push(`/admin/testimonials/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (<><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>) : saved ? (<><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>) : <span>Pret</span>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/admin/testimonials")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {testimonialId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-4 max-w-2xl" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Auteur</label>
            <input className={inputCls} style={inputStyle} {...register("author")} />
            {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Entreprise</label>
            <input className={inputCls} style={inputStyle} {...register("company")} />
          </div>
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Citation</label>
          <textarea className={inputCls} style={inputStyle} rows={5} {...register("quote")} />
          {errors.quote && <p className="mt-1 text-xs text-red-500">{errors.quote.message}</p>}
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Note</label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRating value={Number(field.value)} onChange={(v) => field.onChange(v)} />
            )}
          />
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Photo (optionnel)</label>
          <Controller
            control={control}
            name="photoMediaId"
            render={({ field }) => (
              <MediaPicker
                value={field.value || null}
                onChange={(id) => field.onChange(id || "")}
                mimeFilter="image/"
                triggerLabel="Photo de l'auteur"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ordre</label>
            <input type="number" className={inputCls} style={inputStyle} {...register("orderIdx")} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("visible")} />
              <span className="text-sm" style={{ color: "var(--text)" }}>Visible</span>
            </label>
          </div>
        </div>
      </section>
    </form>
  );
}
