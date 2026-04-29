"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { deletePageSeo, savePageSeo } from "./actions";
import { useRouter } from "next/navigation";

type Row = {
  key: string;
  title: string | null;
  description: string | null;
  ogMediaId: string | null;
};

interface PageSeoFormProps {
  rowKey: string;
  label: string;
  description: string;
  initial: Row | null;
}

export function PageSeoCard({ rowKey, label, description, initial }: PageSeoFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  type V = { title: string; description: string; ogMediaId: string };
  const { register, handleSubmit, control, watch } = useForm<V>({
    defaultValues: {
      title: initial?.title || "",
      description: initial?.description || "",
      ogMediaId: initial?.ogMediaId || "",
    },
  });

  const title = watch("title");
  const desc = watch("description");

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  const onSubmit = (values: V) => {
    start(async () => {
      const res = await savePageSeo({
        key: rowKey,
        title: values.title,
        description: values.description,
        ogMediaId: values.ogMediaId,
      });
      if (res.ok) {
        toast.success(`${label} enregistre`);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function reset() {
    if (!initial) return;
    start(async () => {
      const res = await deletePageSeo(rowKey);
      if (res.ok) {
        toast.success("Reinitialise");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl p-5 space-y-4"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>{label}</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{ color: "var(--color-copper)" }}>
            key: {rowKey}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{description}</p>
        </div>
        {initial && (
          <button
            type="button"
            disabled={pending}
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs disabled:opacity-50"
            style={{ color: "var(--text-muted)" }}
            title="Reinitialiser cette entree"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre SEO</label>
          <input className={inputCls} style={inputStyle} {...register("title")} />
          <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
            {title?.length || 0} char.
          </p>
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description SEO</label>
          <textarea className={inputCls} style={inputStyle} rows={2} {...register("description")} />
          <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
            {desc?.length || 0} char.
          </p>
        </div>
      </div>

      <div>
        <label className={labelCls} style={{ color: "var(--text-muted)" }}>OG image (override)</label>
        <Controller
          control={control}
          name="ogMediaId"
          render={({ field }) => (
            <MediaPicker
              value={field.value || null}
              onChange={(id) => field.onChange(id || "")}
              mimeFilter="image/"
              triggerLabel="Choisir une image OG"
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>
          ) : saved ? (
            <><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
