"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createProject, updateProject } from "./actions";
import { PROJECT_CATEGORIES } from "./constants";

const schema = z.object({
  title: z.string().min(2, "Titre requis"),
  slug: z.string().min(1, "Slug requis"),
  category: z.string().min(1, "Categorie requise"),
  clientName: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  result: z.string().optional(),
  highlight: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().optional(),
  coverMediaId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProjectFormProps {
  projectId?: string;
  initial?: Partial<FormValues>;
}

export function ProjectForm({ projectId, initial }: ProjectFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slugDirty, setSlugDirty] = useState(!!initial?.slug);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title || "",
      slug: initial?.slug || "",
      category: initial?.category || "structures",
      clientName: initial?.clientName || "",
      location: initial?.location || "",
      year: initial?.year ? String(initial.year) : "",
      description: initial?.description || "",
      challenge: initial?.challenge || "",
      solution: initial?.solution || "",
      result: initial?.result || "",
      highlight: initial?.highlight || "",
      status: (initial?.status as FormValues["status"]) || "draft",
      featured: initial?.featured ?? false,
      coverMediaId: initial?.coverMediaId || "",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!slugDirty && title) {
      setValue("slug", slugify(title));
    }
  }, [title, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        title: values.title,
        slug: values.slug,
        category: values.category,
        clientName: values.clientName || null,
        location: values.location || null,
        year: values.year ? Number(values.year) : null,
        description: values.description || null,
        challenge: values.challenge || null,
        solution: values.solution || null,
        result: values.result || null,
        highlight: values.highlight || null,
        status: values.status,
        featured: !!values.featured,
        coverMediaId: values.coverMediaId || null,
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
      };

      const res = projectId
        ? await updateProject(projectId, payload)
        : await createProject(payload);

      if (res.ok) {
        toast.success(projectId ? "Enregistre" : "Projet cree");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!projectId && "id" in res && res.id) {
          router.push(`/admin/projects/${res.id}`);
        }
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  };

  const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
  const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header with save indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...
            </>
          ) : saved ? (
            <>
              <Check className="h-3 w-3" style={{ color: "rgb(34,197,94)" }} /> Enregistre
            </>
          ) : (
            <span>Pret</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
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
            {projectId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Informations generales</h2>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Titre</label>
              <input className={inputCls} style={inputStyle} {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Slug</label>
              <input
                className={`${inputCls} font-mono`}
                style={inputStyle}
                {...register("slug")}
                onChange={(e) => {
                  setSlugDirty(true);
                  setValue("slug", e.target.value);
                }}
              />
              {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categorie</label>
                <select className={inputCls} style={inputStyle} {...register("category")}>
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Annee</label>
                <input type="number" className={inputCls} style={inputStyle} {...register("year")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Client</label>
                <input className={inputCls} style={inputStyle} {...register("clientName")} />
              </div>
              <div>
                <label className={labelCls} style={{ color: "var(--text-muted)" }}>Localisation</label>
                <input className={inputCls} style={inputStyle} {...register("location")} />
              </div>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Highlight (ex: 3200 m2)</label>
              <input className={inputCls} style={inputStyle} {...register("highlight")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Contenu</h2>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("description")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Challenge</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("challenge")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Solution</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("solution")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Resultat</label>
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("result")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>SEO</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>SEO Titre</label>
              <input className={inputCls} style={inputStyle} {...register("seoTitle")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>SEO Description</label>
              <textarea className={inputCls} style={inputStyle} rows={2} {...register("seoDescription")} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Publication</h2>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status</label>
              <select className={inputCls} style={inputStyle} {...register("status")}>
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
                <option value="archived">Archive</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("featured")} />
              <span className="text-sm" style={{ color: "var(--text)" }}>Featured</span>
            </label>
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Image de couverture</h2>
            <Controller
              control={control}
              name="coverMediaId"
              render={({ field }) => (
                <MediaPicker
                  value={field.value || null}
                  onChange={(id) => field.onChange(id || "")}
                  mimeFilter="image/"
                />
              )}
            />
          </section>
        </div>
      </div>
    </form>
  );
}
