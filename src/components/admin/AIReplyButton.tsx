"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";

interface AIReplyButtonProps {
  leadId: string;
  onUse: (text: string) => void;
}

export function AIReplyButton({ leadId, onUse }: AIReplyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isDev, setIsDev] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setWarning(null);
    try {
      const r = await fetch("/api/admin/ai/draft-reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) {
        toast.error(d.error || "Generation echouee");
        return;
      }
      setDraft(d.draft);
      setIsDev(!!d.dev);
      if (d.warning) setWarning(d.warning);
      setOpen(true);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function useDraft() {
    onUse(draft);
    setOpen(false);
    toast.success("Texte applique");
  }

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={generate}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"
        style={{
          background: "color-mix(in oklab, var(--color-copper) 12%, transparent)",
          color: "var(--color-copper)",
          border: "1px solid color-mix(in oklab, var(--color-copper) 30%, transparent)",
        }}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {loading ? "Generation..." : "Generer une reponse avec l'IA"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: "var(--color-copper)" }} />
                <h2 className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>
                  Brouillon IA
                </h2>
                {isDev && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider"
                    style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}
                  >
                    Mode dev
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-[var(--bg-muted)]"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            {warning && (
              <div
                className="px-5 py-2 text-xs"
                style={{
                  background: "color-mix(in oklab, var(--color-copper) 10%, transparent)",
                  color: "var(--color-copper)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {warning}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={14}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-y"
                style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
              />
              <p className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                Vous pouvez editer le brouillon avant de l&apos;utiliser.
              </p>
            </div>

            <div
              className="flex items-center justify-between border-t px-5 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                type="button"
                disabled={loading}
                onClick={generate}
                className="inline-flex items-center gap-1.5 text-xs disabled:opacity-50"
                style={{ color: "var(--color-copper)" }}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                Regenerer
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={useDraft}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
                >
                  <Check className="h-3.5 w-3.5" /> Utiliser ce texte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
