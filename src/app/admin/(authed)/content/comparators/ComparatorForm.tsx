"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import {
  createComparator,
  deleteComparator,
  updateComparator,
  addComparatorRow,
  updateComparatorRow,
  deleteComparatorRow,
  addComparatorUseCase,
  updateComparatorUseCase,
  deleteComparatorUseCase,
  addComparatorFaq,
  updateComparatorFaq,
  deleteComparatorFaq,
} from "./actions";

export const COMPARATOR_CATEGORIES = ["industrielles", "portails", "structures", "menuiserie", "coupe-feu", "automatismes", "maintenance"] as const;

const formSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  optionAName: z.string().min(1),
  optionBName: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  verdict: z.string().min(1),
  category: z.string().min(1),
  accent: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  visible: z.boolean().optional(),
  orderIdx: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type RowItem = { id: string; criterion: string; optionA: string; optionB: string; winner: "A" | "B" | "tie"; orderIdx: number };
type UseCaseItem = { id: string; scenario: string; recommendation: "A" | "B"; reason: string; orderIdx: number };
type FaqItem = { id: string; question: string; answer: string; orderIdx: number };

interface ComparatorFormProps {
  comparatorId?: string;
  initial?: Partial<FormValues>;
  rows?: RowItem[];
  useCases?: UseCaseItem[];
  faqs?: FaqItem[];
}

export function ComparatorForm({ comparatorId, initial, rows = [], useCases = [], faqs = [] }: ComparatorFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: initial?.slug || "",
      title: initial?.title || "",
      optionAName: initial?.optionAName || "Option A",
      optionBName: initial?.optionBName || "Option B",
      tagline: initial?.tagline || "",
      intro: initial?.intro || "",
      verdict: initial?.verdict || "",
      category: initial?.category || "industrielles",
      accent: initial?.accent || "196, 133, 92",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
      visible: initial?.visible ?? true,
      orderIdx: initial?.orderIdx || "0",
    },
  });

  const title = watch("title");
  useEffect(() => { if (!slugDirty && title) setValue("slug", slugify(title)); }, [title, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        slug: values.slug,
        title: values.title,
        optionAName: values.optionAName,
        optionBName: values.optionBName,
        tagline: values.tagline,
        intro: values.intro,
        verdict: values.verdict,
        category: values.category,
        accent: values.accent,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        visible: !!values.visible,
        orderIdx: values.orderIdx ? Number(values.orderIdx) : 0,
      };
      const res = comparatorId ? await updateComparator(comparatorId, payload) : await createComparator(payload);
      if (res.ok) {
        toast.success(comparatorId ? "Enregistre" : "Comparatif cree");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!comparatorId && "id" in res && res.id) router.push(`/admin/content/comparators/${res.id}`);
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  function remove() {
    if (!comparatorId) return;
    start(async () => {
      const res = await deleteComparator(comparatorId);
      if (res.ok) { toast.success("Supprime"); router.push("/admin/content/comparators"); }
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
          <button type="button" onClick={() => router.push("/admin/content/comparators")} className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Annuler</button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{comparatorId ? "Enregistrer" : "Creer"}</button>
        </div>
      </div>

      <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre</label>
            <input className={inputCls} style={inputStyle} {...register("title")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Slug</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} {...register("slug")} onChange={(e) => { setSlugDirty(true); setValue("slug", e.target.value); }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Option A</label>
            <input className={inputCls} style={inputStyle} {...register("optionAName")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Option B</label>
            <input className={inputCls} style={inputStyle} {...register("optionBName")} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categorie</label>
            <select className={inputCls} style={inputStyle} {...register("category")}>
              {COMPARATOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Accent (RGB)</label>
            <input className={`${inputCls} font-mono`} style={inputStyle} placeholder="196, 133, 92" {...register("accent")} />
          </div>
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tagline</label>
          <input className={inputCls} style={inputStyle} {...register("tagline")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Introduction</label>
          <textarea className={inputCls} style={inputStyle} rows={3} {...register("intro")} />
        </div>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Verdict</label>
          <textarea className={inputCls} style={inputStyle} rows={3} {...register("verdict")} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre SEO</label>
            <input className={inputCls} style={inputStyle} {...register("seoTitle")} />
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
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description SEO</label>
          <textarea className={inputCls} style={inputStyle} rows={2} {...register("seoDescription")} />
        </div>
      </section>

      {comparatorId && (
        <>
          <CriteriaSection comparatorId={comparatorId} rows={rows} optionAName={watch("optionAName")} optionBName={watch("optionBName")} />
          <UseCasesSection comparatorId={comparatorId} rows={useCases} />
          <FaqsSection comparatorId={comparatorId} rows={faqs} />

          <section className="rounded-xl p-4 flex items-center justify-between" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text)" }}>Zone de danger</p>
            {confirming ? (
              <div className="flex items-center gap-2">
                <button type="button" disabled={pending} onClick={remove} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">Confirmer la suppression</button>
                <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>Annuler</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <Trash2 className="h-3 w-3" /> Supprimer ce comparatif
              </button>
            )}
          </section>
        </>
      )}
    </form>
  );
}

function CriteriaSection({ comparatorId, rows, optionAName, optionBName }: { comparatorId: string; rows: RowItem[]; optionAName: string; optionBName: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Criteres comparatifs</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>{rows.length} critere{rows.length > 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <CriterionRow key={r.id} comparatorId={comparatorId} row={r} optionAName={optionAName} optionBName={optionBName} />
        ))}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => { await addComparatorRow(comparatorId); router.refresh(); })}
        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
        style={{ borderColor: "var(--border)", color: "var(--text)" }}
      >
        <Plus className="h-4 w-4" /> Ajouter un critere
      </button>
    </section>
  );
}

function CriterionRow({ comparatorId, row, optionAName, optionBName }: { comparatorId: string; row: RowItem; optionAName: string; optionBName: string }) {
  const [criterion, setCriterion] = useState(row.criterion);
  const [optionA, setOptionA] = useState(row.optionA);
  const [optionB, setOptionB] = useState(row.optionB);
  const [winner, setWinner] = useState<"A" | "B" | "tie">(row.winner);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <div className="rounded-lg p-3 space-y-2" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <input className={inputCls} style={inputStyle} value={criterion} onChange={(e) => setCriterion(e.target.value)} placeholder="Critere" />
      <div className="grid grid-cols-2 gap-2">
        <textarea className={inputCls} style={inputStyle} rows={2} value={optionA} onChange={(e) => setOptionA(e.target.value)} placeholder={optionAName} />
        <textarea className={inputCls} style={inputStyle} rows={2} value={optionB} onChange={(e) => setOptionB(e.target.value)} placeholder={optionBName} />
      </div>
      <div className="flex items-center justify-between">
        <select className="rounded px-2 py-1 text-xs" style={inputStyle} value={winner} onChange={(e) => setWinner(e.target.value as "A" | "B" | "tie")}>
          <option value="A">Gagnant : {optionAName}</option>
          <option value="B">Gagnant : {optionBName}</option>
          <option value="tie">Egalite</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => start(async () => {
              const res = await updateComparatorRow(row.id, comparatorId, { criterion, optionA, optionB, winner });
              if (res.ok) toast.success("Enregistre");
              else toast.error(res.error || "Erreur");
            })}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            Enregistrer
          </button>
          {confirming ? (
            <>
              <button type="button" disabled={pending} onClick={() => start(async () => {
                const res = await deleteComparatorRow(row.id, comparatorId);
                if (res.ok) { toast.success("Supprime"); router.refresh(); }
                else toast.error(res.error || "Erreur");
              })} className="rounded-md px-3 py-1.5 text-xs text-white" style={{ background: "var(--color-primary)" }}>OK</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>X</button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="rounded p-1.5" style={{ color: "var(--text-muted)" }} aria-label="Supprimer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function UseCasesSection({ comparatorId, rows }: { comparatorId: string; rows: UseCaseItem[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Cas d&apos;usage</h2>
        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{rows.length} scenario{rows.length > 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => <UseCaseRow key={r.id} comparatorId={comparatorId} row={r} />)}
      </div>
      <button type="button" disabled={pending} onClick={() => start(async () => { await addComparatorUseCase(comparatorId); router.refresh(); })} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
        <Plus className="h-4 w-4" /> Ajouter un scenario
      </button>
    </section>
  );
}

function UseCaseRow({ comparatorId, row }: { comparatorId: string; row: UseCaseItem }) {
  const [scenario, setScenario] = useState(row.scenario);
  const [recommendation, setRecommendation] = useState<"A" | "B">(row.recommendation);
  const [reason, setReason] = useState(row.reason);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <div className="rounded-lg p-3 space-y-2" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <input className={inputCls} style={inputStyle} value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="Scenario" />
      <textarea className={inputCls} style={inputStyle} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Raison" />
      <div className="flex items-center justify-between">
        <select className="rounded px-2 py-1 text-xs" style={inputStyle} value={recommendation} onChange={(e) => setRecommendation(e.target.value as "A" | "B")}>
          <option value="A">Recommandation : A</option>
          <option value="B">Recommandation : B</option>
        </select>
        <div className="flex items-center gap-2">
          <button type="button" disabled={pending} onClick={() => start(async () => {
            const res = await updateComparatorUseCase(row.id, comparatorId, { scenario, recommendation, reason });
            if (res.ok) toast.success("Enregistre");
            else toast.error(res.error || "Erreur");
          })} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Enregistrer</button>
          {confirming ? (
            <>
              <button type="button" disabled={pending} onClick={() => start(async () => {
                const res = await deleteComparatorUseCase(row.id, comparatorId);
                if (res.ok) { toast.success("Supprime"); router.refresh(); }
                else toast.error(res.error || "Erreur");
              })} className="rounded-md px-3 py-1.5 text-xs text-white" style={{ background: "var(--color-primary)" }}>OK</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>X</button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="rounded p-1.5" style={{ color: "var(--text-muted)" }} aria-label="Supprimer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqsSection({ comparatorId, rows }: { comparatorId: string; rows: FaqItem[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>FAQ</h2>
        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{rows.length} question{rows.length > 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => <FaqRow key={r.id} comparatorId={comparatorId} row={r} />)}
      </div>
      <button type="button" disabled={pending} onClick={() => start(async () => { await addComparatorFaq(comparatorId); router.refresh(); })} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
        <Plus className="h-4 w-4" /> Ajouter une FAQ
      </button>
    </section>
  );
}

function FaqRow({ comparatorId, row }: { comparatorId: string; row: FaqItem }) {
  const [question, setQuestion] = useState(row.question);
  const [answer, setAnswer] = useState(row.answer);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm focus:outline-none";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <div className="rounded-lg p-3 space-y-2" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <input className={inputCls} style={inputStyle} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
      <textarea className={inputCls} style={inputStyle} rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Reponse" />
      <div className="flex items-center justify-end gap-2">
        <button type="button" disabled={pending} onClick={() => start(async () => {
          const res = await updateComparatorFaq(row.id, comparatorId, { question, answer });
          if (res.ok) toast.success("Enregistre");
          else toast.error(res.error || "Erreur");
        })} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Enregistrer</button>
        {confirming ? (
          <>
            <button type="button" disabled={pending} onClick={() => start(async () => {
              const res = await deleteComparatorFaq(row.id, comparatorId);
              if (res.ok) { toast.success("Supprime"); router.refresh(); }
              else toast.error(res.error || "Erreur");
            })} className="rounded-md px-3 py-1.5 text-xs text-white" style={{ background: "var(--color-primary)" }}>OK</button>
            <button type="button" onClick={() => setConfirming(false)} className="text-xs" style={{ color: "var(--text-muted)" }}>X</button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="rounded p-1.5" style={{ color: "var(--text-muted)" }} aria-label="Supprimer">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
