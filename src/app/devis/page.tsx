import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { DevisMultiStep } from "@/components/forms/DevisMultiStep";
import { getPageSeo } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("devis");
  return generatePageMetadata({
    title: seo?.title || "Demander un devis gratuit | Métallerie sur mesure",
    description:
      seo?.description ||
      "Obtenez un devis gratuit pour votre projet de métallerie en Île-de-France. Fermetures, portails, structures, coupe-feu, maintenance. Réponse sous 48h.",
    path: "/devis",
    image: seo?.ogImageUrl,
  });
}

export default function DevisPage() {
  return (
    <>
      {/* ═══════════ HERO (DARK + branded photo) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Branded background — bureau d'étude DEVIS IEF & CO (V3 slot #30) */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={ATMOSPHERE.heroDevis}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 50%",
              opacity: 1,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, 0.7) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="transition-colors hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Devis</span>
          </nav>

          {/* Header */}
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Étude gratuite · Réponse 48h
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Demander <span className="text-gradient-metal">un devis</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Décrivez votre projet en quelques étapes. Chaque devis est calculé par notre bureau d&apos;étude — sans engagement.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FORM (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-28">
        <div className="forge-gradient-light" style={{ opacity: 0.6 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
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
    </>
  );
}
