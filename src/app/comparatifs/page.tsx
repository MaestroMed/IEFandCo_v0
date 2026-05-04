import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { comparatifs } from "@/data/comparatifs";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getPageHero } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("comparatifs-index");
  return generatePageMetadata({
    title: seo?.title || "Comparatifs métallerie B2B — Choix techniques argumentés",
    description:
      seo?.description ||
      "Comparatifs détaillés pour vos choix de métallerie B2B : porte sectionnelle vs rideau, contrat préventif vs curatif, motorisation, matériaux, marques. Verdict expert IEF & CO.",
    path: "/comparatifs",
    image: seo?.ogImageUrl,
  });
}

export default async function ComparatifsPage() {
  const heroOverride = await getPageHero("comparatifs-index");
  const heroOpacity = (heroOverride?.opacity ?? 100) / 100;
  const heroObjectPos = heroOverride?.objectPosition ?? "center 50%";
  const heroOverlayLeft = (heroOverride?.overlayLeft ?? 70) / 100;
  const heroIsVideo = heroOverride?.mediaMime?.startsWith("video/");
  return (
    <>
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
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Comparatifs</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              {heroOverride?.eyebrow ?? `${comparatifs.length} comparatifs experts`}
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? (
              <>{heroOverride.title}</>
            ) : (
              <><span className="text-gradient-metal">Comparatifs</span> métallerie</>
            )}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro ?? (
              <>Tableaux comparatifs détaillés et verdicts par cas d&apos;usage pour vos décisions
              techniques B2B.</>
            )}
          </p>
        </div>
      </section>

      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {comparatifs.map((c, i) => (
              <Link
                key={c.slug}
                href={`/comparatif/${c.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* Illustration slab with accent wash */}
                <div className="relative" style={{ borderBottom: "1px solid var(--border)" }}>
                  <ProjectIllustration
                    category={c.category}
                    accentColor={c.accent}
                    hideTitle
                  />
                  {/* Accent overlay */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 60% 50% at 30% 30%, rgba(${c.accent}, 0.18) 0%, transparent 70%)`,
                    }}
                  />
                  {/* Chip: vs pair */}
                  <div
                    className="absolute top-3 left-3 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] pointer-events-none"
                    style={{
                      background: `rgba(${c.accent}, 0.1)`,
                      color: `rgb(${c.accent})`,
                      border: `1px solid rgba(${c.accent}, 0.25)`,
                    }}
                  >
                    CMP-{String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                      {c.optionAName} · vs · {c.optionBName}
                    </span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: `rgb(${c.accent})` }} aria-hidden="true">
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                  <h2 className="font-display text-xl font-bold leading-tight mb-2" style={{ color: "var(--text)" }}>
                    {c.title}
                  </h2>
                  <p className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>{c.tagline}</p>
                  <div className="mt-5 pt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <span>{c.rows.length} critères</span>
                    <span>·</span>
                    <span>{c.useCases.length} cas d&apos;usage</span>
                    <span>·</span>
                    <span>{c.faq.length} FAQ</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
