import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { AssisteoMockup } from "@/components/ui/AssisteoMockup";
import { getPageSeo } from "@/lib/content";
import { ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("assisteo");
  return generatePageMetadata({
    title: seo?.title || "ASSISTEO | Diagnostic technique à distance",
    description:
      seo?.description ||
      "ASSISTEO by IEF & CO : assistance vidéo et diagnostic technique à distance pour vos fermetures industrielles. Réduction des temps d'arrêt, intervention préparée.",
    path: "/assisteo",
    image: seo?.ogImageUrl,
  });
}

const features = [
  {
    title: "Diagnostic immédiat",
    description:
      "Filmez la panne avec votre smartphone. Notre technicien analyse en temps réel et identifie le problème sans déplacement.",
    icon: "video",
  },
  {
    title: "Réduction des temps d'arrêt",
    description:
      "Plus besoin d'attendre un déplacement pour avoir un premier diagnostic. Gagnez des heures critiques.",
    icon: "clock",
  },
  {
    title: "Intervention préparée",
    description:
      "Le technicien arrive avec les bonnes pièces et les bons outils. Un seul déplacement, une résolution au premier passage.",
    icon: "wrench",
  },
  {
    title: "Continuité de service",
    description:
      "Disponible 7j/7 pour les contrats premium. Votre activité ne s'arrête jamais.",
    icon: "shield",
  },
];

const process = [
  { n: "01", title: "Vous filmez", desc: "Votre smartphone, notre lien sécurisé — aucune app à installer." },
  { n: "02", title: "On analyse", desc: "Diagnostic technique en direct avec nos experts métallerie." },
  { n: "03", title: "On planifie", desc: "Intervention préparée avec les bonnes pièces, au bon moment." },
];

// Tech accent — electric blue mix with copper
const techAccent = "80, 180, 220"; // tech cyan

export default function AssisteoPage() {
  return (
    <>
      {/* ═══════════ HERO (DARK TECH) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-[90vh] flex items-center">
        {/* Branded background — hotliner with monitors. Sits beneath all
           tech overlays so it tints the section with a humanised cue. */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={ATMOSPHERE.heroAssisteo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 35%",
              opacity: 0.5,
              filter: "contrast(1.05) brightness(0.85) saturate(0.9)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, 0.78) 50%, rgba(5, 5, 8, 0.35) 80%, rgba(5, 5, 8, 0.15) 100%)",
            }}
          />
        </div>

        {/* Tech mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at var(--gx) var(--gy), rgba(${techAccent}, 0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at var(--gx2) var(--gy2), rgba(${techAccent}, 0.10) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 50% 110%, rgba(196, 133, 92, 0.08) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 50% -20%, rgba(20, 40, 60, 0.35) 0%, transparent 60%)`,
            animation: "gradient-breathe 20s ease-in-out infinite, gradient-breathe-alt 26s ease-in-out infinite",
          }}
        />

        {/* Scanning lines effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(${techAccent}, 0.04) 3px, rgba(${techAccent}, 0.04) 4px)`,
          }}
        />

        {/* Tech grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(${techAccent}, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(${techAccent}, 0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: 0.04,
          }}
        />

        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: `rgb(${techAccent})` }}>ASSISTEO</span>
          </nav>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10" style={{ background: `rgb(${techAccent})` }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${techAccent})` }}>
                  Par IEF & CO · Service exclusif
                </span>
              </div>

              <h1 className="font-display font-bold tracking-tight leading-[0.9]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
                <span style={{ color: "var(--text)" }}>ASSIST</span><span style={{ color: `rgb(${techAccent})` }}>EO</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
                L&apos;extension digitale de l&apos;expertise IEF & CO. Diagnostic vidéo en direct,
                intervention préparée, temps d&apos;arrêt minimisés — par votre métallier,
                sans déplacement inutile.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/contact" size="lg">Demander une démo</Button>
                <Button href="/services/maintenance" variant="secondary" size="lg">Voir nos contrats</Button>
              </div>

              {/* Live indicator */}
              <div className="mt-10 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5" style={{ background: "rgba(80, 180, 220, 0.1)", border: `1px solid rgba(${techAccent}, 0.25)` }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75" style={{ background: `rgb(${techAccent})` }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: `rgb(${techAccent})` }} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: `rgb(${techAccent})` }}>
                  En ligne · Réponse &lt; 5 min
                </span>
              </div>
            </div>

            {/* Phone mockup with tech glow */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${techAccent}, 0.35) 0%, transparent 70%)`,
                }}
              />
              <AssisteoMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESS 3 STEPS (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: `rgb(${techAccent})` }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${techAccent})` }}>
                Processus
              </span>
              <span className="h-px w-8" style={{ background: `rgb(${techAccent})` }} />
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              3 étapes, <span className="italic font-normal" style={{ color: `rgb(${techAccent})` }}>zéro friction</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${techAccent}, 0.35), transparent)` }}
            />

            {process.map((p, i) => (
              <div key={i} className="relative text-center">
                <div
                  className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, rgba(${techAccent}, 0.15) 0%, rgba(${techAccent}, 0.04) 100%)`,
                    border: `1px solid rgba(${techAccent}, 0.3)`,
                    boxShadow: `0 0 0 4px rgba(${techAccent}, 0.05), 0 10px 30px rgba(${techAccent}, 0.1)`,
                  }}
                >
                  <span className="font-display text-3xl font-bold" style={{ color: `rgb(${techAccent})` }}>
                    {p.n}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold" style={{ color: "var(--text)" }}>
                  {p.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES (DARK TECH) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at var(--gx) var(--gy), rgba(${techAccent}, 0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at var(--gx2) var(--gy2), rgba(196, 133, 92, 0.08) 0%, transparent 55%)`,
            animation: "gradient-breathe 22s ease-in-out infinite, gradient-breathe-alt 28s ease-in-out infinite",
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: `rgb(${techAccent})` }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${techAccent})` }}>
                Capacités
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Ce qu&apos;ASSISTEO <span className="text-gradient-metal">apporte</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, rgba(${techAccent}, 0.2) 0%, rgba(${techAccent}, 0.06) 100%)`,
                      border: `1px solid rgba(${techAccent}, 0.25)`,
                    }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: `rgb(${techAccent})` }} aria-hidden="true">
                      {f.icon === "video" && <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}
                      {f.icon === "clock" && <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {f.icon === "wrench" && <path d="M11.42 15.17l-5.1 5.1a2.121 2.121 0 01-3-3l5.1-5.1M18.36 8.04l-3.53 3.53M15.54 12.29l5.66-5.66a2.121 2.121 0 00-3-3l-5.66 5.66" />}
                      {f.icon === "shield" && <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold" style={{ color: "var(--text)" }}>
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.description}
                </p>

                <div
                  className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, rgb(${techAccent}), var(--color-copper))` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA (DARK DRAMATIC) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(${techAccent}, 0.25) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196, 133, 92, 0.12) 0%, transparent 55%)`,
            animation: "gradient-breathe 16s ease-in-out infinite",
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: `rgb(${techAccent})` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${techAccent})` }}>
              Démonstration gratuite
            </span>
            <span className="h-px w-10" style={{ background: `rgb(${techAccent})` }} />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Essayez <span style={{ color: `rgb(${techAccent})` }}>ASSISTEO</span> sur un vrai cas
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            ASSISTEO est disponible pour tous nos clients sous contrat de maintenance.
            Contactez-nous pour une démonstration live sur l&apos;une de vos installations.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/contact" size="lg">Demander une démo</Button>
            <Button href="/services/maintenance" variant="secondary" size="lg">Voir nos contrats</Button>
          </div>
        </div>
      </section>
    </>
  );
}
