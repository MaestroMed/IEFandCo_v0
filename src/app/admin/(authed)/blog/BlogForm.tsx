"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { slugify } from "@/lib/admin/slug";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { SeoPreview } from "@/components/admin/SeoPreview";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createPost, updatePost } from "./actions";
import { BLOG_CATEGORIES } from "./constants";

const schema = z.object({
  title: z.string().min(2, "Titre requis"),
  slug: z.string().min(1, "Slug requis"),
  excerpt: z.string().optional(),
  category: z.enum(BLOG_CATEGORIES),
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  publishedAt: z.string().optional(),
  readingMinutes: z.string().optional(),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverMediaId: z.string().optional(),
  content: z.string().optional(),
  contentHtml: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface BlogFormProps {
  postId?: string;
  initial?: Partial<FormValues>;
}

export function BlogForm({ postId, initial }: BlogFormProps) {
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
      excerpt: initial?.excerpt || "",
      category: (initial?.category as FormValues["category"]) || "Guide",
      status: (initial?.status as FormValues["status"]) || "draft",
      publishedAt: initial?.publishedAt || "",
      readingMinutes: initial?.readingMinutes ? String(initial.readingMinutes) : "5",
      tags: initial?.tags || "",
      seoTitle: initial?.seoTitle || "",
      seoDescription: initial?.seoDescription || "",
      coverMediaId: initial?.coverMediaId || "",
      content: initial?.content || "",
      contentHtml: initial?.contentHtml || "",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");
  const excerpt = watch("excerpt");

  useEffect(() => {
    if (!slugDirty && title) setValue("slug", slugify(title));
  }, [title, slugDirty, setValue]);

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const payload = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt || null,
        content: values.content || "",
        contentHtml: values.contentHtml || null,
        category: values.category,
        status: values.status,
        publishedAt: values.publishedAt || null,
        readingMinutes: values.readingMinutes ? Number(values.readingMinutes) : 5,
        tags: values.tags || null,
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
        coverMediaId: values.coverMediaId || null,
      };

      const res = postId ? await updatePost(postId, payload) : await createPost(payload);
      if (res.ok) {
        toast.success(postId ? "Enregistre" : "Article cree");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!postId && "id" in res && res.id) router.push(`/admin/blog/${res.id}`);
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
            onClick={() => router.push("/admin/blog")}
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
            {postId ? "Enregistrer" : "Creer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
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
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Extrait</label>
              <textarea className={inputCls} style={inputStyle} rows={2} {...register("excerpt")} />
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Contenu</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>TipTap</span>
            </div>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <TiptapEditor
                  value={field.value || ""}
                  onChange={(json, html) => {
                    field.onChange(json);
                    setValue("contentHtml", html);
                  }}
                  placeholder="Ecrivez votre article ici..."
                />
              )}
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Publication</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Categorie</label>
              <select className={inputCls} style={inputStyle} {...register("category")}>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Status</label>
              <select className={inputCls} style={inputStyle} {...register("status")}>
                <option value="draft">Brouillon</option>
                <option value="scheduled">Programme</option>
                <option value="published">Publie</option>
                <option value="archived">Archive</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Publie le</label>
              <input type="datetime-local" className={inputCls} style={inputStyle} {...register("publishedAt")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Lecture (min)</label>
              <input type="number" className={inputCls} style={inputStyle} {...register("readingMinutes")} />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Couverture</label>
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
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Tags (virgules)</label>
              <input className={inputCls} style={inputStyle} {...register("tags")} />
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
              <textarea className={inputCls} style={inputStyle} rows={3} {...register("seoDescription")} />
            </div>
          </section>

          <SeoPreview
            title={seoTitle || title || ""}
            description={seoDescription || excerpt || ""}
            path={`/blog/${slug || ""}`}
          />
        </div>
      </div>
    </form>
  );
}
