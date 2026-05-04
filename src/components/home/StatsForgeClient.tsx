"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 5, suffix: "+", label: "Années d'expérience", sub: "Depuis 2020" },
  { value: 500, suffix: "+", label: "Projets réalisés", sub: "Île-de-France" },
  { value: 24, suffix: "h", label: "Délai dépannage", sub: "Sur contrat" },
  { value: 1090, suffix: "", label: "EN 1090", sub: "Certifié EXC2" },
];

export interface StatsForgeClientProps {
  bgImageUrl?: string;
  bgImageAlt?: string;
  bgOpacity?: number;
  bgObjectPosition?: string;
  /** Centre du radial overlay 0-100 — plus haut = plus sombre au centre. */
  overlayCenterStrength?: number;
}

export function StatsForgeClient({
  bgImageUrl,
  bgImageAlt,
  bgOpacity = 1,
  bgObjectPosition = "center 50%",
  overlayCenterStrength = 55,
}: StatsForgeClientProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const centerAlpha = Math.max(0, Math.min(100, overlayCenterStrength)) / 100;

  return (
    <section className="section-forge-transition relative overflow-hidden py-28 md:py-36">
      {/* Optional background image (BO-driven via getPageHero("home-stats")) */}
      {bgImageUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={bgImageUrl}
            alt={bgImageAlt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: bgObjectPosition,
              opacity: bgOpacity,
            }}
          />
          {/* Radial darkener: keep the centre legible while drowning the edges */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(5,5,8,${centerAlpha}) 0%, rgba(5,5,8,0.85) 100%)`,
            }}
          />
        </div>
      )}

      {/* Static gradient overlay (only visible on the dark portion) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 30% 40%, rgba(196, 133, 92, 0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 75% 60%, rgba(212, 165, 116, 0.10) 0%, transparent 55%)",
          maskImage: "linear-gradient(180deg, black 0%, black 55%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, black 55%, transparent 90%)",
        }}
      />

      {/* Top accent rule */}
      <div className="section-rule-top" />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              En chiffres
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.5rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            La preuve par
            <br />
            <span className="number-glow text-gradient-metal">les chiffres</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="group relative rounded-2xl p-8 text-center overflow-hidden transition-all duration-500"
              style={{
                background: "rgba(20, 20, 26, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3), 0 10px 40px rgba(0,0,0,0.25)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              {/* Hover warm glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196, 133, 92, 0.15) 0%, transparent 70%)",
                }}
              />

              {/* Index */}
              <div className="relative flex items-center justify-center gap-2 mb-5">
                <span className="h-px w-3" style={{ background: "var(--color-copper)", opacity: 0.5 }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-3" style={{ background: "var(--color-copper)", opacity: 0.5 }} />
              </div>

              <div className="relative font-mono text-5xl font-bold md:text-6xl number-glow" style={{ color: "var(--text)" }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
              </div>
              <p className="relative mt-4 font-display text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
              <p className="relative mt-1 text-xs font-mono uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>{stat.sub}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 transition-all duration-500 group-hover:w-[80%]"
                style={{ background: "linear-gradient(90deg, transparent, var(--color-copper), transparent)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
