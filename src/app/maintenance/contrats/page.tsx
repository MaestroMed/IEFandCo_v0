import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Contrats de maintenance porte industrielle — Bronze, Argent, Or",
  description:
    "Comparez nos 3 niveaux de contrat de maintenance porte industrielle, sectionnelle et fermeture professionnelle : Bronze (préventif), Argent (préventif + curatif), Or (full-service 24/7). Étude gratuite.",
  path: "/maintenance/contrats",
});

const tiers = [
  {
    name: "Bronze",
    color: "184, 130, 90", // copper
    tagline: "Le préventif essentiel",
    pricing: "À partir de 480 €/an",
    pricingNote: "par porte · maintenance préventive seule",
    target: "PME avec 1-5 portes peu sollicitées",
    sla: "5 jours ouvrés",
    visits: "1 visite/an",
    coverage: "Préventif uniquement",
    features: [
      { included: true, text: "1 visite préventive annuelle" },
      { included: true, text: "Vérification réglementaire (arrêté 21/12/1993)" },
      { included: true, text: "PV d'intervention détaillé" },
      { included: true, text: "Carnet d'entretien numérique" },
      { included: true, text: "Tarif préférentiel sur dépannages curatifs" },
      { included: false, text: "Dépannages curatifs inclus" },
      { included: false, text: "Pièces détachées d'usure" },
      { included: false, text: "Astreinte 24/7" },
      { included: false, text: "Délai d'intervention garanti" },
      { included: false, text: "Audit annuel parc complet" },
    ],
    cta: "Demander un Bronze",
  },
  {
    name: "Argent",
    color: "212, 165, 116", // gold
    tagline: "Le standard B2B",
    pricing: "À partir de 980 €/an",
    pricingNote: "par porte · préventif + curatif inclus",
    target: "Sites tertiaires & PME industrielles avec 5-20 portes",
    sla: "24h ouvrées",
    visits: "2 visites/an",
    coverage: "Préventif + Curatif sous SLA",
    featured: true,
    features: [
      { included: true, text: "2 visites préventives semestrielles" },
      { included: true, text: "Vérification réglementaire (arrêté 21/12/1993)" },
      { included: true, text: "PV d'intervention détaillé + photos" },
      { included: true, text: "Carnet d'entretien numérique" },
      { included: true, text: "Dépannages curatifs illimités sous 24h ouvrées" },
      { included: true, text: "Pièces d'usure incluses (joints, roulements, ressorts)" },
      { included: true, text: "Hotline technique 8h-18h" },
      { included: true, text: "Reporting trimestriel" },
      { included: false, text: "Astreinte nuit / week-end" },
      { included: false, text: "Audit annuel parc complet" },
    ],
    cta: "Demander un Argent",
  },
  {
    name: "Or",
    color: "225, 16, 33", // primary red
    tagline: "Le full-service critique",
    pricing: "À partir de 1 750 €/an",
    pricingNote: "par porte · full-service 24/7 + audit",
    target: "Logistique, e-commerce, agroalimentaire, hospitalier",
    sla: "4h sous astreinte 24/7",
    visits: "4 visites/an",
    coverage: "Préventif + Curatif + Audit + Astreinte",
    features: [
      { included: true, text: "4 visites préventives trimestrielles" },
      { included: true, text: "Vérification réglementaire complète" },
      { included: true, text: "PV + photos + vidéo diagnostique ASSISTEO" },
      { included: true, text: "Carnet d'entretien numérique premium" },
      { included: true, text: "Dépannages curatifs illimités sous 4h" },
      { included: true, text: "Toutes pièces détachées incluses" },
      { included: true, text: "Hotline technique 24h/24, 7j/7" },
      { included: true, text: "Reporting mensuel + KPIs disponibilité" },
      { included: true, text: "Astreinte nuit + week-end + jours fériés" },
      { included: true, text: "Audit annuel parc complet + plan pluriannuel" },
    ],
    cta: "Demander un Or",
  },
];

export default function ContratsMaintenancePage() {
  return (
    <>
      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/services/maintenance" className="hover:opacity-80">Maintenance</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Contrats</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              3 niveaux · 100% modulables
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Contrats de <span className="text-gradient-metal">maintenance</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Bronze, Argent, Or. Trois niveaux d&apos;engagement, un seul objectif&nbsp;: garder vos
            fermetures professionnelles opérationnelles, conformes et tracées.
          </p>
        </div>
      </section>

      {/* COMPARATOR */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.3 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            {tiers.map((tier) => {
              const isFeatured = "featured" in tier && tier.featured;
              return (
                <div
                  key={tier.name}
                  className="relative flex flex-col rounded-3xl overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    border: isFeatured ? `2px solid rgb(${tier.color})` : "1px solid var(--border)",
                    boxShadow: isFeatured ? `0 30px 80px rgba(${tier.color}, 0.18)` : "var(--card-shadow-hover)",
                    transform: isFeatured ? "scale(1.02)" : undefined,
                  }}
                >
                  {isFeatured && (
                    <div
                      className="absolute top-0 left-0 right-0 py-2 text-center font-mono text-[10px] uppercase tracking-[0.25em]"
                      style={{ background: `rgb(${tier.color})`, color: "white" }}
                    >
                      Le plus demandé
                    </div>
                  )}

                  <div className={`p-8 md:p-10 ${isFeatured ? "pt-12" : ""}`}>
                    {/* Tier name */}
                    <div className="flex items-baseline justify-between mb-5">
                      <h2 className="font-display text-3xl font-bold" style={{ color: `rgb(${tier.color})` }}>
                        {tier.name}
                      </h2>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        Niv. {tier.name === "Bronze" ? "01" : tier.name === "Argent" ? "02" : "03"}
                      </span>
                    </div>

                    <p className="font-display text-base font-medium mb-6" style={{ color: "var(--text-secondary)" }}>
                      {tier.tagline}
                    </p>

                    {/* Pricing */}
                    <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>
                        {tier.pricing}
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{tier.pricingNote}</p>
                    </div>

                    {/* Quick specs */}
                    <dl className="mb-6 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--text-muted)" }}>Pour</dt>
                        <dd className="text-right font-medium" style={{ color: "var(--text)" }}>{tier.target}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--text-muted)" }}>SLA</dt>
                        <dd className="text-right font-mono font-semibold" style={{ color: `rgb(${tier.color})` }}>{tier.sla}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--text-muted)" }}>Visites</dt>
                        <dd className="text-right font-medium" style={{ color: "var(--text)" }}>{tier.visits}</dd>
                      </div>
                    </dl>

                    {/* Features list */}
                    <ul className="space-y-2.5 mb-8">
                      {tier.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          {f.included ? (
                            <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: `rgb(${tier.color})` }} role="img" aria-label="Inclus">
                              <path d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(0, 0, 0, 0.18)" }} role="img" aria-label="Non inclus">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span style={{ color: f.included ? "var(--text)" : "var(--text-muted)" }}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/devis?contrat=maintenance"
                      className="block w-full rounded-xl py-3.5 text-center font-semibold text-sm transition-all hover:scale-[1.02]"
                      style={{
                        background: `rgb(${tier.color})`,
                        color: "white",
                        boxShadow: `0 10px 25px rgba(${tier.color}, 0.25)`,
                      }}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div
            className="mt-12 mx-auto max-w-2xl rounded-2xl p-6 text-center"
            style={{
              background: "rgba(196, 133, 92, 0.06)",
              border: "1px solid rgba(196, 133, 92, 0.18)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text)" }}>Tarifs indicatifs hors taxes</strong>, à
              partir de 5 portes au contrat. Devis personnalisé sous 48h après visite préalable
              gratuite. Conditions complètes au format PDF disponibles sur demande.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CONTRACT */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Pourquoi un contrat ?
              </span>
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              3 raisons de souscrire
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Obligation légale",
                desc: "L'arrêté du 21 décembre 1993 impose un entretien semestriel de toutes les portes automatiques sur les lieux de travail. Le contrat de maintenance est la preuve de votre conformité en cas de contrôle inspection du travail.",
              },
              {
                title: "Coût d'une panne",
                desc: "Une porte de quai HS coûte en moyenne 800-1500 € par jour d'arrêt sur un site logistique (camions immobilisés, surcoûts personnel, pénalités client). Un contrat à 1000 €/an se rentabilise dès la première panne évitée.",
              },
              {
                title: "Sécurité personnel",
                desc: "Une porte mal entretenue peut causer un accident grave (rupture de ressort de torsion, défaut de détection anti-écrasement). Votre responsabilité d'employeur est engagée — le contrat de maintenance vous protège juridiquement.",
              },
            ].map((reason, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-7"
              >
                <div className="font-mono text-3xl font-bold mb-4" style={{ color: "var(--color-copper)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: "var(--text)" }}>
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Devis contrat <br />
            <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>sur mesure</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Visite gratuite de votre parc, devis détaillé sous 48h, contrat sans engagement la
            première année.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/devis?contrat=maintenance" size="lg">Demander un devis</Button>
            <Button href="/contact" variant="secondary" size="lg">Parler à un expert</Button>
          </div>
        </div>
      </section>
    </>
  );
}
