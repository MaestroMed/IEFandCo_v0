"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-forge-dark relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="forge-gradient-dark" />
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 max-w-xl text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-10" style={{ background: "var(--color-primary)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
            ERR · 500 · INTERNAL
          </span>
          <span className="h-px w-10" style={{ background: "var(--color-primary)" }} />
        </div>

        <h1 className="font-display font-bold leading-[0.9] tracking-tight" style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}>
          <span className="text-gradient-metal">Erreur</span>
        </h1>

        <p className="mt-6 font-display text-xl md:text-2xl" style={{ color: "var(--text)" }}>
          Quelque chose s&apos;est mal soudé
        </p>
        <p className="mx-auto mt-3 max-w-md text-base" style={{ color: "var(--text-secondary)" }}>
          Une erreur technique est survenue. Vous pouvez réessayer la page,
          ou revenir à l&apos;accueil. Nous avons été notifiés.
        </p>

        {error.digest && (
          <p className="mt-4 inline-block rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ background: "rgba(196, 133, 92, 0.1)", border: "1px solid rgba(196, 133, 92, 0.2)", color: "var(--color-copper)" }}>
            Réf · {error.digest}
          </p>
        )}

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Button onClick={reset} size="lg">Réessayer</Button>
          <Button href="/" variant="secondary" size="lg">Retour à l&apos;accueil</Button>
        </div>
      </div>
    </section>
  );
}
