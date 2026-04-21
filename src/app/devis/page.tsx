import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { DevisMultiStep } from "@/components/forms/DevisMultiStep";

export const metadata: Metadata = generatePageMetadata({
  title: "Demander un devis gratuit | Metallerie sur mesure",
  description:
    "Obtenez un devis gratuit pour votre projet de metallerie en Ile-de-France. Fermetures, portails, structures, coupe-feu, maintenance. Reponse sous 48h.",
  path: "/devis",
});

export default function DevisPage() {
  return (
    <section className="section-forge-light relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen">
      {/* Ambient warm gradient */}
      <div className="forge-gradient-light" style={{ opacity: 0.6 }} />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="transition-colors hover:opacity-80">Accueil</Link>
          <span style={{ color: "var(--border-strong)" }}>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Devis</span>
        </nav>

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
              Étude gratuite · Réponse 48h
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Demander
            <br />
            <span className="text-gradient-metal">un devis</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Décrivez votre projet en quelques étapes. Chaque devis est calculé par notre bureau d&apos;étude — sans engagement.
          </p>
        </div>

        {/* Trust row */}
        <div className="mb-12 grid grid-cols-3 gap-4">
          {[
            { label: "Réponse", value: "48h" },
            { label: "Étude", value: "Gratuite" },
            { label: "Interlocuteur", value: "Unique" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="font-display text-2xl font-bold" style={{ color: "var(--color-copper)" }}>{item.value}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow-hover)",
          }}
        >
          <DevisMultiStep />
        </div>

        {/* Reassurance */}
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          <span className="inline-flex items-center gap-2">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            EN 1090 · EXC2
          </span>
          <span className="h-3 w-px" style={{ background: "var(--border-strong)" }} />
          <span className="inline-flex items-center gap-2">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Confidentiel
          </span>
          <span className="h-3 w-px" style={{ background: "var(--border-strong)" }} />
          <span className="inline-flex items-center gap-2">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Sans engagement
          </span>
        </div>
      </div>
    </section>
  );
}
