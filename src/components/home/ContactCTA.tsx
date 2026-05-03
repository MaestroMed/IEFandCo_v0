"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { ATMOSPHERE } from "@/lib/photoMap";

function EmberField({ count = 10 }: { count?: number }) {
  const embers = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${(i * 100 / count + (i % 3) * 3) % 100}%`,
    size: 2 + (i % 4),
    duration: 14 + (i % 5) * 1.8,
    delay: i * 1.4,
    drift: (i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 8),
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember"
          style={{
            left: e.left,
            bottom: "-8px",
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ["--ember-drift" as string]: `${e.drift}px`,
            ["--ember-duration" as string]: `${e.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function ContactCTA() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="section-forge-dark relative overflow-hidden py-32 md:py-44">
      {/* Branded background — luminous corridor centered behind CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={ATMOSPHERE.sectionCta}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 50%",
            opacity: 0.6,
            filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(5, 5, 8, 0.55) 0%, rgba(5, 5, 8, 0.85) 100%)",
          }}
        />
      </div>

      {/* Most dramatic living gradient */}
      <div className="forge-gradient-cta" />

      {/* Workshop atmosphere — heat haze + breathing copper glow */}
      <WorkshopAtmosphere intensity={1} origin="bottom" />

      {/* Central forge glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 55%, rgba(232, 121, 43, 0.18) 0%, transparent 60%)",
        }}
      />

      {/* Rising embers */}
      <EmberField count={10} />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Parlons-en
            </span>
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
          </div>

          <h2 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre projet
            <br />
            <span className="text-gradient-metal">commence ici</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Parlons de vos besoins en métallerie. Étude gratuite, devis détaillé,
            <br className="hidden md:inline" />
            un seul interlocuteur de la conception à la pose.
          </p>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button href="/contact" size="lg">Contactez-nous</Button>
            <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <a
              href="tel:+33134058703"
              className="group inline-flex items-center gap-3 text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:scale-110"
                style={{
                  background: "rgba(196, 133, 92, 0.12)",
                  border: "1px solid rgba(196, 133, 92, 0.25)",
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Téléphone</div>
                <div className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>01 34 05 87 03</div>
              </div>
            </a>
            <div className="h-8 w-px" style={{ background: "var(--border-strong)" }} />
            <a
              href="mailto:contact@iefandco.com"
              className="group inline-flex items-center gap-3 text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:scale-110"
                style={{
                  background: "rgba(196, 133, 92, 0.12)",
                  border: "1px solid rgba(196, 133, 92, 0.25)",
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>E-mail</div>
                <div className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>contact@iefandco.com</div>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade to footer */}
      <div className="edge-light-to-dark" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%)" }} />
    </section>
  );
}
