"use client";

import { motion } from "motion/react";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/Button";
import { CADIllustration } from "@/components/ui/CADIllustration";

const features = [
  {
    title: "Modélisation 3D",
    desc: "Notes de calcul Eurocode 3, plans d'exécution détaillés",
    icon: (
      <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    ),
  },
  {
    title: "Choix matière",
    desc: "Acier, inox, aluminium — optimisé pour performance et budget",
    icon: (
      <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    ),
  },
  {
    title: "Suivi complet",
    desc: "Un seul interlocuteur du relevé au DOE",
    icon: (
      <path d="M4.5 12.75l6 6 9-13.5" />
    ),
  },
];

export function BureauEtude() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="section-forge-dark relative overflow-hidden py-28 md:py-36">
      {/* Living gradient background */}
      <div className="forge-gradient-dark" />

      {/* Blueprint grid — full width, very subtle */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.06 }} />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Ingénierie intégrée
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.25rem] leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Un <span className="text-gradient-metal">bureau d&apos;étude</span> où chaque trait compte
            </h2>

            <p className="mt-6 text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Chez IEF & CO, le bureau d&apos;étude est le point de départ de chaque réussite.
              Nous transformons une idée en un projet clair, chiffré et réalisable — avec la rigueur que la charpente métallique exige.
            </p>

            <div className="mt-10 space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  className="glass-card flex gap-4 rounded-xl p-5 transition-transform duration-300 hover:translate-x-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, rgba(196, 133, 92, 0.18) 0%, rgba(196, 133, 92, 0.06) 100%)",
                      border: "1px solid rgba(196, 133, 92, 0.22)",
                    }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }}>
                      {f.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Button href="/a-propos">Découvrir notre approche</Button>
            </div>
          </motion.div>

          {/* Right — CAD illustration with warm glow behind */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            {/* Warm glow */}
            <div
              className="absolute -inset-10 -z-10 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(196, 133, 92, 0.18) 0%, transparent 70%)",
              }}
            />

            {/* CAD inside glass frame */}
            <div
              className="relative rounded-2xl p-4 glass-card overflow-hidden"
              style={{ minHeight: "420px" }}
            >
              <CADIllustration />

              {/* Corner brackets */}
              <svg className="absolute top-3 left-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                <path d="M2 8V2h6" stroke="var(--blueprint-ink)" strokeWidth="1.2" />
              </svg>
              <svg className="absolute top-3 right-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                <path d="M12 2h6v6" stroke="var(--blueprint-ink)" strokeWidth="1.2" />
              </svg>
              <svg className="absolute bottom-3 left-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                <path d="M2 12v6h6" stroke="var(--blueprint-ink)" strokeWidth="1.2" />
              </svg>
              <svg className="absolute bottom-3 right-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
                <path d="M18 12v6h-6" stroke="var(--blueprint-ink)" strokeWidth="1.2" />
              </svg>

              {/* Title block */}
              <div
                className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              >
                <span>PROJ · STRUCTURE-PT</span>
                <span>REV · 04</span>
              </div>
            </div>

            {/* Certification badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 rounded-xl px-6 py-4 glass-card-warm"
              style={{
                boxShadow: "0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(196, 133, 92, 0.3)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <p className="font-mono text-2xl font-bold" style={{ color: "var(--color-copper)" }}>EN 1090</p>
              <p className="mt-0.5 text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>Certification EXC2</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
