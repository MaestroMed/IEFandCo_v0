"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SeoPreview } from "@/components/admin/SeoPreview";
import { updateStaticSeo } from "../actions";

interface Props {
  pageKey: string;
  path: string;
  name: string;
  initial: { title: string; description: string };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function StaticSeoForm({ pageKey, path, name, initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateStaticSeo(pageKey, title, description);
      if (res.ok) {
        toast.success("SEO mis a jour");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/seo/meta")}
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
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
                Surcharges SEO — {name}
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Ces valeurs sont stockees dans <code className="font-mono">settings:seo:{pageKey}</code> et viennent
                ecraser les valeurs codees en dur de la page publique. Laissez vide pour conserver le defaut.
              </p>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                style={inputStyle}
                placeholder="Titre meta de la page"
              />
              <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                {title.length} / 60 caracteres recommandes
              </p>
            </div>

            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls}
                style={inputStyle}
                placeholder="Description meta affichee dans les SERP"
              />
              <p className="mt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                {description.length} / 160 caracteres recommandes
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <SeoPreview title={title} description={description} path={path} />
        </div>
      </div>
    </form>
  );
}
