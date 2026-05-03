import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { getRealisations, getPageSeo } from "@/lib/content";
import { getRealisationPhoto, ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("realisations-index");
  return generatePageMetadata({
    title: seo?.title || "Nos Réalisations | Portfolio métallerie",
    description:
      seo?.description ||
      "Découvrez les réalisations d'IEF & CO : charpentes, façades, portails, fermetures industrielles. Projets en Île-de-France pour l'industrie et le tertiaire.",
    path: "/realisations",
    image: seo?.ogImageUrl,
  });
}

// Masonry aspect ratios per index — creates rhythm
const aspects = [
  "aspect-[4/3]",     // 1
  "aspect-[3/4]",     // 2 tall
  "aspect-[4/3]",     // 3
  "aspect-[4/3]",     // 4
  "aspect-[3/4]",     // 5 tall
  "aspect-[4/3]",     // 6
];

export default async function RealisationsPage() {
  const realisations = await getRealisations();
  return (
    <>
      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Branded background — portfolio mood-board on workshop wall */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={ATMOSPHERE.heroRealisations}
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

        <div className="forge-gradient-dark" style={{ opacity: 0.5 }} />
        <WorkshopAtmosphere intensity={0.4} origin="bottom" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Réalisations</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Portfolio · {realisations.length} projets sélectionnés
            </span>
          </div>
          <div className="grid items-end gap-8 md:grid-cols-3 md:gap-16">
            <div className="md:col-span-2">
              <h1 className="max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Nos <span className="text-gradient-metal">réalisations</span>
              </h1>
            </div>
            <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Un aperçu de nos projets récents. Charpentes, façades, portails, fermetures industrielles —
              chaque ouvrage témoigne d&apos;une rigueur d&apos;exécution.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY (DARK MASONRY) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pb-28 md:pb-36">
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
            {realisations.map((project, i) => (
              <Link
                key={project.slug}
                href={`/realisations/${project.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Real photo with Forged Light treatment — DB cover takes precedence */}
                <Photo
                  src={
                    project.coverUrl && !project.coverMime?.startsWith("video/")
                      ? project.coverUrl
                      : getRealisationPhoto(project.slug, project.category)
                  }
                  alt={project.coverAlt || project.title}
                  aspect={aspects[i % aspects.length]}
                  brackets
                  caption={`${project.year} · ${project.category}`}
                  treatment="moody"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  priority={i < 3}
                />

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-[var(--color-copper)]" style={{ color: "var(--text)" }}>
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {project.description}
                  </p>

                  <div
                    className="mt-5 pt-5 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        Client
                      </p>
                      <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--text)" }}>
                        {project.client}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        {project.location}
                      </p>
                      <p className="mt-0.5 font-display text-sm font-bold" style={{ color: "var(--color-copper)" }}>
                        {project.highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent — grows on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: "linear-gradient(90deg, var(--color-copper), var(--color-primary))" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA (WARM GRADIENT) ═══════════ */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Prochain chantier
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre projet, <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>ici</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Chaque projet de ce portfolio a commencé par un appel. Le vôtre peut être le prochain.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/contact" size="lg">Parlons de votre projet</Button>
            <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
          </div>
        </div>
      </section>
    </>
  );
}
