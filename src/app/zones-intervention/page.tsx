import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { zones } from "@/data/zones";
import { Button } from "@/components/ui/Button";
import ZonesMapClient from "@/components/ui/ZonesMapClient";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getPageHero } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("zones-intervention");
  return generatePageMetadata({
    title: seo?.title || "Zones d'intervention — Île-de-France complète",
    description:
      seo?.description ||
      "IEF & CO intervient sur l'ensemble de l'Île-de-France : Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95), Yvelines (78), Seine-et-Marne (77), Essonne (91). Délais d'intervention garantis sous contrat.",
    path: "/zones-intervention",
    image: seo?.ogImageUrl,
  });
}

export default async function ZonesInterventionPage() {
  const heroOverride = await getPageHero("zones-intervention");
  const heroOpacity = (heroOverride?.opacity ?? 100) / 100;
  const heroObjectPos = heroOverride?.objectPosition ?? "center 50%";
  const heroOverlayLeft = (heroOverride?.overlayLeft ?? 70) / 100;
  const heroIsVideo = heroOverride?.mediaMime?.startsWith("video/");
  return (
    <>
      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {heroOverride?.mediaUrl && (
          <div className="absolute inset-0 pointer-events-none">
            {heroIsVideo ? (
              <video
                src={heroOverride.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: heroObjectPos,
                  opacity: heroOpacity,
                  filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
                }}
              />
            ) : (
              <Image
                src={heroOverride.mediaUrl}
                alt={heroOverride.mediaAlt ?? ""}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{
                  objectPosition: heroObjectPos,
                  opacity: heroOpacity,
                  filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
                }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, ${heroOverlayLeft}) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)`,
              }}
            />
          </div>
        )}
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Zones d&apos;intervention</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              {heroOverride?.eyebrow ?? "8 départements · Île-de-France complète"}
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? (
              <>{heroOverride.title}</>
            ) : (
              <>Présents <span className="text-gradient-metal">partout en Île-de-France</span></>
            )}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro ?? (
              <>Notre atelier à Groslay (95) nous place au centre du maillage francilien.
              Nous intervenons sur les 8 départements avec des délais garantis sous contrat.</>
            )}
          </p>
        </div>
      </section>

      {/* ZONES GRID */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Cliquez sur un département
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Une expertise locale <br />
              <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>pour chaque zone</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone) => (
              <Link
                key={zone.slug}
                href={`/zones/${zone.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl font-mono text-base font-bold transition-transform group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, rgba(196, 133, 92, 0.18) 0%, rgba(196, 133, 92, 0.06) 100%)",
                      color: "var(--color-copper)",
                      border: "1px solid rgba(196, 133, 92, 0.25)",
                    }}
                  >
                    {zone.code}
                  </div>
                  {zone.slug === "val-d-oise" && (
                    <span
                      className="rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.18em]"
                      style={{
                        background: "var(--color-primary)",
                        color: "white",
                      }}
                    >
                      Siège
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {zone.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                  {zone.tagline}
                </p>
                <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Urgence</div>
                    <div className="text-sm font-semibold" style={{ color: "var(--color-copper)" }}>{zone.slaUrgence}</div>
                  </div>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: "linear-gradient(90deg, var(--color-copper), var(--color-primary))" }}
                />
              </Link>
            ))}
          </div>

          {/* Carte interactive Mapbox (fallback SVG si pas de token) */}
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Carte interactive · Survolez un département
              </span>
            </div>
            <ZonesMapClient height={500} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre site est <br />
            <span className="text-gradient-metal">en Île-de-France ?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Étude gratuite, devis détaillé, intervention selon votre département.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/devis" size="lg">Demander un devis</Button>
            <Button href="/contact" variant="secondary" size="lg">Nous contacter</Button>
          </div>
        </div>
      </section>
    </>
  );
}
