import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { TeamMember } from "@/components/ui/TeamMember";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { getTeam, getPageSeo } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("a-propos");
  return generatePageMetadata({
    title: seo?.title || "À propos | Expert en construction métallique sur mesure",
    description:
      seo?.description ||
      "IEF & CO : concepteur et fabricant de solutions métalliques à Groslay (95). Bureau d'étude intégré, fabrication certifiée EN 1090, service ASSISTEO.",
    path: "/a-propos",
    image: seo?.ogImageUrl,
  });
}

const values = [
  { title: "Rigueur technique", description: "Chaque solution est pensée, calculée et contrôlée." },
  { title: "Sur-mesure réel", description: "Aucun projet standardisé, chaque ouvrage est adapté." },
  { title: "Transparence", description: "Devis clairs, explications précises, engagement tenu." },
  { title: "Durabilité", description: "Matériaux, finitions et conception pensés pour durer." },
  { title: "Réactivité", description: "Intervention rapide, maintenance anticipée, assistance continue." },
];

export default async function AProposPage() {
  const team = await getTeam();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "À propos", url: "/a-propos" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Workshop atmosphere photo — branded IEF & CO 3-artisans shot,
           kept readable behind the mission copy. */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={ATMOSPHERE.about}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 45%",
              opacity: 1,
              filter: "contrast(1.08) brightness(1.02) saturate(1.08)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, #050508 16%, rgba(5, 5, 8, 0.7) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)",
            }}
          />
        </div>

        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.55} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>À propos</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Maison fondée en 2020 · Groslay, 95
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            L&apos;art du métal, <span className="text-gradient-metal">la rigueur d&apos;un atelier</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            IEF & CO est une maison indépendante de métallerie-serrurerie, fondée sur l&apos;exigence technique
            et la relation directe avec le client. Ici, chaque trait est pesé, chaque soudure contrôlée.
          </p>
        </div>
      </section>

      {/* ═══════════ MISSION + VISION (LIGHT EDITORIAL) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                01 · Mission
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Transformer un besoin technique en <span className="text-gradient-metal">ouvrage tenu</span>
              </h2>
              <p className="mt-6 leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
                IEF & CO conçoit, fabrique et installe des solutions métalliques professionnelles pour des
                environnements industriels, tertiaires, logistiques et ERP.
              </p>
              <p className="mt-4 leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
                Notre promesse tient en une phrase&nbsp;: transformer des besoins techniques complexes
                en solutions métalliques maîtrisées — sans compromis sur la sécurité, la qualité, la durabilité.
              </p>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                02 · Vision
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Au-delà du métal, <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>l&apos;exploitation</span>
              </h2>
              <p className="mt-6 leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
                La métallerie ne se limite pas à fabriquer du métal. Chaque projet doit faciliter l&apos;exploitation,
                sécuriser les accès, optimiser les flux et réduire les coûts à long terme.
              </p>
              <p className="mt-4 leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
                De l&apos;analyse des contraintes du site à la maintenance, en passant par la conception sur mesure
                et la fabrication contrôlée — nous accompagnons chaque projet de bout en bout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESS TIMELINE (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                03 · Méthodologie
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              5 étapes pour transformer
              <br />
              <span className="text-gradient-metal">une idée en ouvrage posé</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Du premier relevé à la maintenance : une méthodologie éprouvée, appliquée à chaque chantier.
            </p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {/* ═══════════ TEAM (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  04 · L&apos;équipe
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Bureau d&apos;étude, atelier,
                <br />
                <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>chantier</span>
              </h2>
            </div>
            <p className="max-w-md text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Une seule équipe, du relevé à la pose. Un seul interlocuteur pour vous, un projet cohérent de bout en bout.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <TeamMember key={i} {...member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ VALUES (WARM) ═══════════ */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" style={{ opacity: 0.65 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                05 · Nos valeurs
              </span>
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Ce qui nous <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>engage</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="font-mono text-5xl font-bold" style={{ color: "rgba(196, 133, 92, 0.2)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold" style={{ color: "var(--text)" }}>
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ASSISTEO TEASER (DARK DRAMATIC) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Innovation maison
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            <span className="text-gradient-metal">ASSISTEO</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Notre service exclusif d&apos;assistance vidéo et de diagnostic technique à distance.
            Diagnostic immédiat sans déplacement, réduction des temps d&apos;arrêt, meilleure préparation des interventions.
          </p>
          <div className="mt-10">
            <Button href="/assisteo" size="lg">Découvrir ASSISTEO</Button>
          </div>
        </div>
      </section>
    </>
  );
}
