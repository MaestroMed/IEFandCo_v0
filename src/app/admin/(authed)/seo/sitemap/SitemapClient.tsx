"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, RefreshCw } from "lucide-react";
import { regenerateSitemap, updateRobotsTxt } from "./actions";

export function SitemapActions() {
  const [pending, start] = useTransition();
  const router = useRouter();

  function onRegenerate() {
    start(async () => {
      const res = await regenerateSitemap();
      if (res.ok) {
        toast.success("Regeneration demandee, peut prendre 60s");
        router.refresh();
      } else {
        toast.error("Erreur");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onRegenerate}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
      style={{ border: "1px solid var(--border)", color: "var(--text)" }}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
      Forcer regeneration
    </button>
  );
}

export function RobotsEditor({ initial, isCustom }: { initial: string; isCustom: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initial);

  function onSave() {
    start(async () => {
      const res = await updateRobotsTxt(content);
      if (res.ok) {
        toast.success("robots.txt enregistre");
        setEditing(false);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {isCustom ? "Personnalise" : "Defaut Next.js"}
        </span>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-xs hover:text-primary"
            style={{ color: "var(--color-copper)" }}
          >
            <Pencil className="h-3 w-3" /> Editer
          </button>
        ) : (
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</span>}
          </span>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setContent(initial); setEditing(false); }}
              className="rounded-lg border px-4 py-2 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={pending}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </>
      ) : (
        <pre
          className="rounded-lg p-4 text-xs font-mono whitespace-pre-wrap"
          style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {initial}
        </pre>
      )}
    </div>
  );
}
