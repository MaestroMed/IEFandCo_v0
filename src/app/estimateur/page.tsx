import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuoteEstimator } from "@/components/forms/QuoteEstimator";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getPageHero } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("estimateur");
  return generatePageMetadata({
    title: seo?.title || "Estimateur de prix instantané — métallerie B2B",
    description:
      seo?.description ||
      "Obtenez une estimation instantanée pour porte sectionnelle, rideau métallique, portail, coupe-feu ou contrat de maintenance. Devis détaillé gratuit sous 48h.",
    path: "/estimateur",
    image: seo?.ogImageUrl,
  });
}

export default async function EstimateurPage() {
  const heroOverride = await getPageHero("estimateur");
  const heroImage = heroOverride?.mediaUrl ?? ATMOSPHERE.heroEstimateur;
  const heroOpacity = (heroOverride?.opacity ?? 100) / 100;
  const heroObjectPos = heroOverride?.objectPosition ?? "center 50%";
  const heroOverlayLeft = (heroOverride?.overlayLeft ?? 70) / 100;
  const heroIsVideo = heroOverride?.mediaMime?.startsWith("video/");
  return (
    <>
      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
        {/* Branded background — tablet configurator + brushed steel samples */}
        <div className="absolute inset-0 pointer-events-none">
          {heroIsVideo ? (
            <video
              src={heroImage}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: heroObjectPos,
                opacity: heroOpacity,
                filter: "contrast(1.08) brightness(1.02) saturate(1.08)",
              }}
            />
          ) : (
            <Image
              src={heroImage}
              alt={heroOverride?.mediaAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: heroObjectPos,
                opacity: heroOpacity,
                filter: "contrast(1.08) brightness(1.02) saturate(1.08)",
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                `linear-gradient(105deg, #050508 16%, rgba(5, 5, 8, ${heroOverlayLeft}) 38%, rgba(5, 5, 8, 0.2) 65%, rgba(5, 5, 8, 0) 100%)`,
            }}
          />
        </div>

        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Estimateur</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              {heroOverride?.eyebrow ?? "Calculateur · fourchette indicative"}
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? (
              <>{heroOverride.title}</>
            ) : (
              <><span className="text-gradient-metal">Combien</span><br />
              ça coûte ?</>
            )}
          </h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro ?? (
              <>Estimez instantanément votre projet en 3 étapes. Transparent, sans engagement,
              devis précis gratuit sous 48h.</>
            )}
          </p>
        </div>
      </section>

      {/* ESTIMATOR */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-28">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <QuoteEstimator />
        </div>
      </section>

      {/* REASSURANCE STRIP */}
      <section className="border-y" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Étude gratuite", desc: "Devis précis sous 48h" },
              { label: "Transparent", desc: "Tarifs 2026 mis à jour" },
              { label: "Sans engagement", desc: "Rien à signer pour l'estimation" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="h-5 w-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div>
                  <div className="font-display font-semibold" style={{ color: "var(--text)" }}>
                    {item.label}
                  </div>
                  <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forge-warm relative overflow-hidden py-20 md:py-28">
        <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Besoin d&apos;un <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>devis précis</span> ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
            Chaque projet est unique. Notre bureau d&apos;étude analyse votre site et vous remet un devis
            détaillé sous 48h ouvrées.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button href="/devis" size="lg">Demander un devis</Button>
            <Button href="/contact" variant="secondary" size="lg">Parler à un expert</Button>
          </div>
        </div>
      </section>
    </>
  );
}
