"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { ClientLogoBadge } from "@/components/ui/ClientLogoBadge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createClient, updateClient } from "./actions";
import { PERMISSION_STATUSES } from "./constants";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  website: z.string().optional(),
  permissionStatus: z.enum(PERMISSION_STATUSES),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
  logoMediaId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ClientFormProps {
  clientId?: string;
  initial?: Partial<FormValues>;
}

export function ClientForm({ clientId, initial }: ClientFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name || "",
      website: initial?.website || "",
      permissionStatus: (initial?.permissionStatus as FormValues["permissionStatus"]) || "not_asked",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx !== undefined && initial?.orderIdx !== null ? String(initial.orderIdx) : "0",
      logoMediaId: initial?.logoMediaId || "",
    },
  });

  const name = watch("name");

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        ...values,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
        visible: !!values.visible,
        logoMediaId: values.logoMediaId || null,
      };
      const res = clientId ? await updateClient(clientId, payload) : await createClient(payload);
      if (res.ok) {
        toast.success(clientId ? "Enregistre" : "Client ajoute");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!clientId && "id" in res && res.id) router.push(`/admin/clients/${res.id}`);
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
          <button type="button" onClick={() => router.push("/admin/clients")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {clientId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom de l&apos;entreprise</label>
            <input className={inputCls} style={inputStyle} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Site web</label>
            <input type="url" className={inputCls} style={inputStyle} placeholder="https://..." {...register("website")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Autorisation d&apos;affichage</label>
            <select className={inputCls} style={inputStyle} {...register("permissionStatus")}>
              <option value="not_asked">Non demandee</option>
              <option value="pending">En attente</option>
              <option value="granted">Accordee</option>
              <option value="declined">Refusee</option>
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Logo</label>
            <Controller
              control={control}
              name="logoMediaId"
              render={({ field }) => (
                <MediaPicker
                  value={field.value || null}
                  onChange={(id) => field.onChange(id || "")}
                  mimeFilter="image/"
                  triggerLabel="Choisir le logo client"
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

        <section className="rounded-xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>Apercu badge</div>
          <div className="flex items-center justify-center py-4">
            {name ? <ClientLogoBadge name={name} variant="stamped" /> : <span className="text-xs" style={{ color: "var(--text-muted)" }}>Entrez un nom</span>}
          </div>
        </section>
      </div>
    </form>
  );
}
