import Link from "next/link";
import { getServices } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Nos Services en Métallerie & Serrurerie",
  description:
    "Découvrez les 7 domaines d'expertise d'IEF & CO : fermetures industrielles, portails, structures métalliques, menuiserie, coupe-feu, automatismes et maintenance.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.06 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Services</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Catalogue · 7 domaines d&apos;expertise
            </span>
          </div>
          <div className="grid items-end gap-8 md:grid-cols-3 md:gap-16">
            <div className="md:col-span-2">
              <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Nos <span className="text-gradient-metal">services</span>
              </h1>
            </div>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
              De la conception à la maintenance, IEF & CO couvre l&apos;ensemble de vos besoins
              en solutions métalliques sur mesure. Chaque domaine est dimensionné, fabriqué et posé par nos équipes.
            </p>
          </div>

          {/* Meta strip */}
          <div className="mt-10 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--color-copper)" }} />
              EN 1090 · EXC2
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--color-copper)" }} />
              Eurocode 3
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--color-copper)" }} />
              EN 13241
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--color-copper)" }} />
              EN 16034
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES GRID (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--card-shadow)",
                  }}
                >
                  {/* Hand-drawn blueprint illustration with service accent */}
                  <div className="relative" style={{ borderBottom: "1px solid var(--border)" }}>
                    <ProjectIllustration
                      category={service.slug}
                      accentColor={service.accentColor}
                      hideTitle
                    />

                    {/* SVC code chip */}
                    <div
                      className="absolute top-3 right-3 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] pointer-events-none"
                      style={{
                        background: `rgba(${service.accentColor}, 0.08)`,
                        color: `rgb(${service.accentColor})`,
                        border: `1px solid rgba(${service.accentColor}, 0.22)`,
                      }}
                    >
                      SVC-{String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Service color wash on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 60% 50% at 30% 30%, rgba(${service.accentColor}, 0.18) 0%, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h2
                      className="font-display text-xl font-bold leading-tight transition-colors"
                      style={{ color: "var(--text)" }}
                    >
                      {service.shortTitle}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {service.shortDescription}
                    </p>

                    {/* Prestations count + CTA */}
                    <div className="mt-6 flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        {service.subServices.length} prestations
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: `rgb(${service.accentColor})` }}>
                        Découvrir
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, rgb(${service.accentColor}), var(--color-copper))` }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Catalogue footer — drawing-sheet style */}
          <div
            className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl p-8"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div className="font-mono text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <p style={{ color: "var(--color-primary)" }} className="uppercase tracking-[0.25em] font-semibold">IEF & CO</p>
              <p className="mt-1">CATALOGUE DE SERVICES · 2026 · REV A1</p>
              <p className="mt-0.5">ÉCHELLE 1:1 — Île-de-France</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button href="/devis">Demander un devis</Button>
              <Button href="/contact" variant="secondary">Nous contacter</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
