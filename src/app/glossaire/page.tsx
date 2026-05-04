import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { glossary, getTermsByCategory } from "@/data/glossary";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getPageHero } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("glossaire-index");
  return generatePageMetadata({
    title: seo?.title || "Glossaire technique métallerie & fermetures industrielles",
    description:
      seo?.description ||
      "Glossaire complet des termes techniques de la métallerie : EN 1090, EI 60, ressort de torsion, motorisation tubulaire, ATEX, HACCP... 50+ définitions par les experts IEF & CO.",
    path: "/glossaire",
    image: seo?.ogImageUrl,
  });
}

const categoryOrder = ["Norme", "Réglementation", "Composant", "Technique", "Méthode", "Sécurité"];

const categoryColors: Record<string, string> = {
  "Norme": "196, 133, 92",       // copper
  "Réglementation": "225, 16, 33", // primary red
  "Composant": "80, 180, 220",     // tech cyan
  "Technique": "212, 165, 116",    // gold
  "Méthode": "166, 124, 82",       // earth
  "Sécurité": "232, 121, 43",      // amber
};

export default async function GlossairePage() {
  const byCategory = getTermsByCategory();
  const heroOverride = await getPageHero("glossaire-index");

  return (
    <>
      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Branded background — technical reference atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={heroOverride?.imageUrl || ATMOSPHERE.heroGlossaire}
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
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Glossaire</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              {heroOverride?.eyebrow || `${glossary.length} termes · 6 catégories`}
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? <>{heroOverride.title}</> : <><span className="text-gradient-metal">Glossaire</span> métallerie</>}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro || "Toutes les définitions techniques, normatives et réglementaires de la métallerie B2B — par les experts IEF & CO."}
          </p>
        </div>
      </section>

      {/* CATEGORY ANCHORS */}
      <section className="border-y" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-wrap gap-3">
            {categoryOrder.filter((cat) => byCategory[cat]).map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: `rgba(${categoryColors[cat] || "196, 133, 92"}, 0.1)`,
                  border: `1px solid rgba(${categoryColors[cat] || "196, 133, 92"}, 0.25)`,
                  color: `rgb(${categoryColors[cat] || "196, 133, 92"})`,
                }}
              >
                <span>{cat}</span>
                <span className="font-mono text-[10px] opacity-70">({byCategory[cat]?.length || 0})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TERMS BY CATEGORY */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          {categoryOrder.filter((cat) => byCategory[cat]).map((cat) => (
            <div key={cat} id={cat.toLowerCase()} className="mb-16 last:mb-0 scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px w-10" style={{ background: `rgb(${categoryColors[cat]})` }} />
                <h2 className="font-display text-2xl font-bold md:text-3xl" style={{ color: `rgb(${categoryColors[cat]})` }}>
                  {cat}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  {byCategory[cat].length} termes
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {byCategory[cat].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/glossaire/${t.slug}`}
                    className="group flex items-start gap-4 rounded-xl p-5 transition-all hover:-translate-y-1"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold leading-tight transition-colors" style={{ color: "var(--text)" }}>
                        {t.term}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {t.shortDef}
                      </p>
                    </div>
                    <svg className="h-4 w-4 mt-1 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: `rgb(${categoryColors[cat]})` }} aria-hidden="true">
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
