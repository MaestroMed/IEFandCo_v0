"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { initialsOf } from "@/lib/admin/slug";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createTeamMember, updateTeamMember } from "./actions";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  role: z.string().min(1, "Role requis"),
  expertise: z.string().min(1, "Expertise requise"),
  initials: z.string().min(1).max(3),
  orderIdx: z.string().optional(),
  visible: z.boolean().optional(),
  photoMediaId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TeamFormProps {
  memberId?: string;
  initial?: Partial<FormValues>;
}

export function TeamForm({ memberId, initial }: TeamFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [initialsDirty, setInitialsDirty] = useState(!!initial?.initials);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name || "",
      role: initial?.role || "",
      expertise: initial?.expertise || "",
      initials: initial?.initials || "",
      orderIdx: initial?.orderIdx !== undefined && initial?.orderIdx !== null ? String(initial.orderIdx) : "0",
      visible: initial?.visible ?? true,
      photoMediaId: initial?.photoMediaId || "",
    },
  });

  const name = watch("name");
  const initials = watch("initials");

  useEffect(() => {
    if (!initialsDirty && name) setValue("initials", initialsOf(name));
  }, [name, initialsDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        ...values,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
        visible: !!values.visible,
        photoMediaId: values.photoMediaId || null,
      };
      const res = memberId ? await updateTeamMember(memberId, payload) : await createTeamMember(payload);
      if (res.ok) {
        toast.success(memberId ? "Enregistre" : "Membre ajoute");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!memberId && "id" in res && res.id) router.push(`/admin/team/${res.id}`);
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
          <button type="button" onClick={() => router.push("/admin/team")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {memberId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom complet</label>
            <input className={inputCls} style={inputStyle} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Role / Poste</label>
            <input className={inputCls} style={inputStyle} {...register("role")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Expertise</label>
            <textarea className={inputCls} style={inputStyle} rows={3} {...register("expertise")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Photo</label>
            <Controller
              control={control}
              name="photoMediaId"
              render={({ field }) => (
                <MediaPicker
                  value={field.value || null}
                  onChange={(id) => field.onChange(id || "")}
                  mimeFilter="image/"
                  triggerLabel="Choisir une photo de profil"
                />
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Initiales</label>
              <input
                className={`${inputCls} font-mono uppercase`}
                style={inputStyle}
                maxLength={3}
                {...register("initials")}
                onChange={(e) => {
                  setInitialsDirty(true);
                  setValue("initials", e.target.value.toUpperCase());
                }}
              />
            </div>
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

        <section className="rounded-xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Apercu</div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full font-mono text-2xl font-bold" style={{ background: "var(--color-copper)", color: "white" }}>
              {initials || "?"}
            </div>
            <div className="mt-4 font-display text-lg font-semibold" style={{ color: "var(--text)" }}>{name || "Nom"}</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>{watch("role") || "Role"}</div>
          </div>
        </section>
      </div>
    </form>
  );
}
