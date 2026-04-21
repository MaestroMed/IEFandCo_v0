"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateLegal } from "../actions";

interface Props {
  initial: { mentions: string; privacy: string };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function LegalForm({ initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mentions, setMentions] = useState(initial.mentions);
  const [privacy, setPrivacy] = useState(initial.privacy);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await updateLegal({ mentions, privacy });
      if (res.ok) {
        toast.success("Pages legales enregistrees");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</span>}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Enregistrer
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Contenu en markdown. Une fois enregistre, les pages publiques <code className="font-mono">/mentions-legales</code> et <code className="font-mono">/politique-confidentialite</code> liront ces valeurs en priorite (migration des pages publiques en cours).
      </p>

      <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Mentions legales</h2>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Markdown</label>
          <textarea
            rows={16}
            value={mentions}
            onChange={(e) => setMentions(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="# Mentions legales&#10;&#10;## Editeur&#10;..."
          />
        </div>
      </section>

      <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Politique de confidentialite</h2>
        <div>
          <label className={labelCls} style={{ color: "var(--text-muted)" }}>Markdown</label>
          <textarea
            rows={16}
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className={inputCls}
            style={inputStyle}
            placeholder="# Politique de confidentialite&#10;&#10;## Donnees collectees&#10;..."
          />
        </div>
      </section>
    </form>
  );
}
