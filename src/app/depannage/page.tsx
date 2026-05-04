import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { depannageServices } from "@/data/depannage";
import { zones } from "@/data/zones";
import { Button } from "@/components/ui/Button";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getPageHero, getCompanyInfo } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("depannage-index");
  return generatePageMetadata({
    title: seo?.title || "Dépannage urgent métallerie Île-de-France",
    description:
      seo?.description ||
      "Dépannage d'urgence porte sectionnelle, rideau métallique, portail, coupe-feu, porte rapide. Intervention dans les 8 départements IDF. Stock pièces permanent, toutes marques.",
    path: "/depannage",
    image: seo?.ogImageUrl,
  });
}

export default async function DepannageIndexPage() {
  const [heroOverride, company] = await Promise.all([
    getPageHero("depannage-index"),
    getCompanyInfo(),
  ]);
  return (
    <>
      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Branded background — IEF & CO night intervention van (V3 slot #32) */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={heroOverride?.imageUrl || ATMOSPHERE.heroDepannage}
            alt={heroOverride?.imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: heroOverride?.objectPosition || "center 50%",
              opacity: (heroOverride?.opacity ?? 100) / 100,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                `linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, ${(heroOverride?.overlayLeft ?? 70) / 100}) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)`,
            }}
          />
        </div>

        <div className="forge-gradient-dark" style={{ opacity: 0.5 }} />
        <WorkshopAtmosphere intensity={0.4} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.04 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Dépannage urgent</span>
          </nav>

          <div className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 mb-6" style={{ background: "rgba(225, 16, 33, 0.1)", border: "1px solid rgba(225, 16, 33, 0.3)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75" style={{ background: "var(--color-primary)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-primary)" }} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-primary)" }}>
              {heroOverride?.eyebrow || "Urgence 24/7 sur contrat"}
            </span>
          </div>

          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? <>{heroOverride.title}</> : <><span className="text-gradient-metal">Dépannage urgent</span><br />métallerie Île-de-France</>}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro || `${depannageServices.length} types d'interventions × ${zones.length} départements IDF. Stock pièces permanent pour ${depannageServices.reduce((sum, s) => sum + s.brands.length, 0)}+ marques différentes.`}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-3 rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-105"
              style={{ background: "var(--color-primary)", boxShadow: "0 10px 30px rgba(225, 16, 33, 0.3)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {company.phoneDisplay}
            </a>
            <Button href="/maintenance/contrats" variant="secondary" size="lg">Voir nos contrats</Button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.3 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                {depannageServices.length} types d&apos;interventions
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Sélectionnez votre <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>équipement en panne</span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {depannageServices.map((s) => (
              <div
                key={s.slug}
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* Blueprint thumbnail */}
                <div className="relative" style={{ borderBottom: "1px solid var(--border)" }}>
                  <ProjectIllustration
                    category={s.relatedServices[0] || "industrielles"}
                    accentColor={s.accentColor}
                    hideTitle
                  />
                  <div
                    className="absolute top-3 left-3 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] pointer-events-none"
                    style={{
                      background: `rgba(${s.accentColor}, 0.12)`,
                      color: `rgb(${s.accentColor})`,
                      border: `1px solid rgba(${s.accentColor}, 0.25)`,
                    }}
                  >
                    URG · {s.commonFailures.length} pannes
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {s.label}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mt-1 shrink-0" style={{ color: "var(--text-muted)" }}>
                      {s.brands.length} marques
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                    {s.tagline}
                  </p>

                  <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "var(--text-muted)" }}>
                      Par département
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {zones.map((z) => (
                        <Link
                          key={z.slug}
                          href={`/depannage/${s.slug}/${z.slug}`}
                          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-mono transition-all hover:scale-105"
                          style={{
                            background: `rgba(${s.accentColor}, 0.08)`,
                            border: `1px solid rgba(${s.accentColor}, 0.2)`,
                            color: `rgb(${s.accentColor})`,
                          }}
                        >
                          {z.code}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-forge-warm relative overflow-hidden py-20 md:py-24">
        <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre équipement <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>n&apos;est pas listé ?</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
            Nous intervenons aussi sur d&apos;autres fermetures métalliques : appelez-nous pour un diagnostic.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button href="/contact" size="lg">Nous contacter</Button>
            <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
          </div>
        </div>
      </section>
    </>
  );
}
