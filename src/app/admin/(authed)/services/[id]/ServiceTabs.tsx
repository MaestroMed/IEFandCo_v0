"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SeoPreview } from "@/components/admin/SeoPreview";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  updateService,
  addSubService,
  updateSubService,
  deleteSubService,
  addFaq,
  updateFaq,
  deleteFaq,
} from "../actions";

type Service = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  shortDescription: string;
  fullDescription: string | null;
  icon: string;
  accentColor: string | null;
  orderIdx: number;
  visible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  coverMediaId: string | null;
};

type SubServiceRow = { id: string; title: string; description: string; orderIdx: number };
type FaqRow = { id: string; question: string; answer: string; orderIdx: number };

interface ServiceTabsProps {
  service: Service;
  subServices: SubServiceRow[];
  faqs: FaqRow[];
}

type Tab = "content" | "subs" | "faqs" | "seo";

const ICONS = ["factory", "gate", "shield", "flame", "cog", "wrench", "door", "building"] as const;

const contentSchema = z.object({
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().optional(),
  icon: z.string().min(1),
  accentColor: z.string().optional(),
  orderIdx: z.string().optional(),
  visible: z.boolean().optional(),
  coverMediaId: z.string().optional(),
});

const seoSchema = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export function ServiceTabs({ service, subServices, faqs }: ServiceTabsProps) {
  const [tab, setTab] = useState<Tab>("content");

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "content", label: "Contenu" },
    { id: "subs", label: "Sous-services", count: subServices.length },
    { id: "faqs", label: "FAQs", count: faqs.length },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="relative px-4 py-2.5 text-sm transition-colors"
            style={{
              color: tab === t.id ? "var(--text)" : "var(--text-muted)",
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                {t.count}
              </span>
            )}
            {tab === t.id && (
              <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {tab === "content" && <ContentTab service={service} />}
      {tab === "subs" && <SubServicesTab serviceId={service.id} rows={subServices} />}
      {tab === "faqs" && <FaqsTab serviceId={service.id} rows={faqs} />}
      {tab === "seo" && <SeoTab service={service} />}
    </div>
  );
}

function ContentTab({ service }: { service: Service }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  type V = z.infer<typeof contentSchema>;
  const { register, handleSubmit, control, formState: { errors } } = useForm<V>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: service.title,
      shortTitle: service.shortTitle,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription || "",
      icon: service.icon,
      accentColor: service.accentColor || "",
      orderIdx: String(service.orderIdx),
      visible: service.visible,
      coverMediaId: service.coverMediaId || "",
    },
  });

  const onSubmit = (values: V) => {
    start(async () => {
      const res = await updateService(service.id, {
        ...values,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
        visible: !!values.visible,
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
        coverMediaId: values.coverMediaId || null,
      });
      if (res.ok) {
        toast.success("Enregistre");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre</label>
            <input className={inputCls} style={inputStyle} {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre court</label>
            <input className={inputCls} style={inputStyle} {...register("shortTitle")} />
          </div>
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description courte</label>
          <textarea className={inputCls} style={inputStyle} rows={2} {...register("shortDescription")} />
        </div>

        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description complete</label>
          <textarea className={inputCls} style={inputStyle} rows={5} {...register("fullDescription")} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Icone</label>
            <select className={inputCls} style={inputStyle} {...register("icon")}>
              {ICONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Couleur d&apos;accent</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="59, 130, 180" {...register("accentColor")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Ordre</label>
            <input type="number" className={inputCls} style={inputStyle} {...register("orderIdx")} />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("visible")} />
          <span className="text-sm" style={{ color: "var(--text)" }}>Visible sur le site</span>
        </label>
      </section>

      <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text)" }}>Media de couverture</h3>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Image ou video affichee sur la fiche service et la liste /services.
        </p>
        <Controller
          control={control}
          name="coverMediaId"
          render={({ field }) => (
            <MediaPicker
              value={field.value || null}
              onChange={(id) => field.onChange(id || "")}
              mimeFilter={["image/", "video/"]}
            />
          )}
        />
      </section>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (<><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>) : saved ? (<><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>) : null}
        </div>
        <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          Enregistrer
        </button>
      </div>
    </form>
  );
}

function SubServicesTab({ serviceId, rows }: { serviceId: string; rows: SubServiceRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((r) => (
          <SubServiceRowEditor key={r.id} serviceId={serviceId} row={r} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => start(async () => { await addSubService(serviceId); router.refresh(); })}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
        style={{ borderColor: "var(--border)", color: "var(--text)" }}
      >
        <Plus className="h-4 w-4" /> Ajouter un sous-service
      </button>
    </div>
  );
}

function SubServiceRowEditor({ serviceId, row }: { serviceId: string; row: SubServiceRow }) {
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <input
        className="w-full rounded-lg px-3 py-2 text-sm font-medium focus:outline-none"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
      />
      <textarea
        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await updateSubService(row.id, { title, description });
              if (res.ok) toast.success("Enregistre");
              else toast.error(res.error || "Erreur");
            })
          }
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Enregistrer
        </button>
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteSubService(row.id, serviceId);
                  if (res.ok) {
                    toast.success("Supprime");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Erreur");
                  }
                })
              }
              className="rounded-md px-3 py-1.5 text-xs text-white"
              style={{ background: "var(--color-primary)" }}
            >
              Confirmer
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-md p-1.5"
            style={{ color: "var(--text-muted)" }}
            aria-label="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function FaqsTab({ serviceId, rows }: { serviceId: string; rows: FaqRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rows.map((r) => (
          <FaqRowEditor key={r.id} serviceId={serviceId} row={r} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => start(async () => { await addFaq(serviceId); router.refresh(); })}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
        style={{ borderColor: "var(--border)", color: "var(--text)" }}
      >
        <Plus className="h-4 w-4" /> Ajouter une FAQ
      </button>
    </div>
  );
}

function FaqRowEditor({ serviceId, row }: { serviceId: string; row: FaqRow }) {
  const [question, setQuestion] = useState(row.question);
  const [answer, setAnswer] = useState(row.answer);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <input
        className="w-full rounded-lg px-3 py-2 text-sm font-medium focus:outline-none"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
      />
      <textarea
        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder="Reponse"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await updateFaq(row.id, { question, answer });
              if (res.ok) toast.success("Enregistre");
              else toast.error(res.error || "Erreur");
            })
          }
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Enregistrer
        </button>
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteFaq(row.id, serviceId);
                  if (res.ok) {
                    toast.success("Supprime");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Erreur");
                  }
                })
              }
              className="rounded-md px-3 py-1.5 text-xs text-white"
              style={{ background: "var(--color-primary)" }}
            >
              Confirmer
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-md p-1.5"
            style={{ color: "var(--text-muted)" }}
            aria-label="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function SeoTab({ service }: { service: Service }) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  type V = z.infer<typeof seoSchema>;
  const { register, handleSubmit, watch } = useForm<V>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
    },
  });

  const t = watch("seoTitle");
  const d = watch("seoDescription");

  const onSubmit = (values: V) => {
    start(async () => {
      const res = await updateService(service.id, {
        title: service.title,
        shortTitle: service.shortTitle,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        icon: service.icon,
        accentColor: service.accentColor,
        orderIdx: service.orderIdx,
        visible: service.visible,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        coverMediaId: service.coverMediaId,
      });
      if (res.ok) {
        toast.success("Enregistre");
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre SEO</label>
          <input className={inputCls} style={inputStyle} {...register("seoTitle")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description SEO</label>
          <textarea className={inputCls} style={inputStyle} rows={4} {...register("seoDescription")} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {pending ? (<><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</>) : saved ? (<><Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre</>) : null}
          </div>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            Enregistrer
          </button>
        </div>
      </section>
      <SeoPreview title={t || service.title} description={d || service.shortDescription} path={`/services/${service.slug}`} />
    </form>
  );
}
