"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Unified cinematic journey: bureau → atelier → pose → livré
const HeroJourney = dynamic(
  () => import("./HeroJourney").then((m) => m.HeroJourney),
  { ssr: false, loading: () => null }
);

// Hand-drawn blueprint carousel that chains the 7 service families.
// Loaded client-only because it uses AnimatePresence + useEffect-driven timers.
const HeroServiceCarousel = dynamic(
  () => import("./HeroServiceCarousel").then((m) => m.HeroServiceCarousel),
  { ssr: false, loading: () => null }
);

/**
 * Parallax isometric grid plane — extremely subtle, amber tinted.
 */
function IsometricGrid({ tiltX, tiltY }: { tiltX: ReturnType<typeof useSpring>; tiltY: ReturnType<typeof useSpring> }) {
  const rotateX = useTransform(tiltY, [-50, 50], [62, 58]);
  const rotateZ = useTransform(tiltX, [-50, 50], [-1, 1]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
      <motion.div
        className="absolute"
        style={{
          left: "-50%",
          top: "40%",
          width: "200%",
          height: "200%",
          transformStyle: "preserve-3d",
          rotateX,
          rotateZ,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(196, 133, 92, 0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(196, 133, 92, 0.9) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.05,
            maskImage: "radial-gradient(ellipse 50% 60% at 50% 0%, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 60% at 50% 0%, black 30%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Refined amber embers — minimal count for perf.
 */
function EmberField() {
  const embers = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    left: `${(i * 17 + 5) % 100}%`,
    size: 2 + (i % 3),
    duration: 16 + (i % 4) * 2,
    delay: i * 2.4,
    drift: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 10),
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

export function HeroSection() {
  const [ready, setReady] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseX, { damping: 30, stiffness: 60 });
  const tiltY = useSpring(mouseY, { damping: 30, stiffness: 60 });

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);

    // Throttle mouse tracking with rAF so we set motion values at most once per frame
    let pendingX = 0;
    let pendingY = 0;
    let rafId = 0;
    let stopped = false;
    let active = false;

    const flush = () => {
      rafId = 0;
      if (stopped) return;
      mouseX.set(pendingX);
      mouseY.set(pendingY);
    };

    const handle = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pendingX = (e.clientX / w - 0.5) * 100;
      pendingY = (e.clientY / h - 0.5) * 100;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    // Only attach the listener when the hero is actually in view (saves CPU on scroll)
    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting;
      if (inView && !active) {
        window.addEventListener("mousemove", handle, { passive: true });
        active = true;
      } else if (!inView && active) {
        window.removeEventListener("mousemove", handle);
        active = false;
      }
    });
    const heroEl = document.querySelector(".section-forge-dark");
    if (heroEl) observer.observe(heroEl);

    return () => {
      stopped = true;
      clearTimeout(t);
      if (rafId) cancelAnimationFrame(rafId);
      if (active) window.removeEventListener("mousemove", handle);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <section className="section-forge-dark relative flex min-h-screen items-center overflow-hidden">
      {/* Atmosphere photo — heavily desaturated welder, very low opacity bg */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/photos/hero-welder-dark.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 30%",
            opacity: 0.18,
            filter: "grayscale(0.7) contrast(1.2) brightness(0.7)",
          }}
        />
        {/* Cover with section bg color via mask gradient — keeps the photo only at top-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, #050508 35%, rgba(5, 5, 8, 0.55) 60%, rgba(5, 5, 8, 0.85) 100%)",
          }}
        />
      </div>

      {/* Living mesh gradient — warm copper/amber overlay */}
      <div className="mesh-gradient-hero" />

      {/* Workshop atmosphere — slow-breathing copper glow + heat haze */}
      <WorkshopAtmosphere intensity={0.6} origin="bottom" />

      {/* Subtle isometric grid */}
      <IsometricGrid tiltX={tiltX} tiltY={tiltY} />

      {/* Hero illustration sequence — cycles through the 7 service drawings.
          Size scales with breakpoint to avoid colliding with title copy
          at smaller desktop widths. */}
      {isLg && (
        <div
          className="absolute hidden lg:block xl:hidden"
          style={{ right: "3%", top: "50%", transform: "translateY(-50%)" }}
        >
          <HeroServiceCarousel tiltX={tiltX} tiltY={tiltY} size={480} />
        </div>
      )}
      {isLg && (
        <div
          className="absolute hidden xl:block 2xl:hidden"
          style={{ right: "3%", top: "50%", transform: "translateY(-50%)" }}
        >
          <HeroServiceCarousel tiltX={tiltX} tiltY={tiltY} size={560} />
        </div>
      )}
      {isLg && (
        <div
          className="absolute hidden 2xl:block"
          style={{ right: "3%", top: "50%", transform: "translateY(-50%)" }}
        >
          <HeroServiceCarousel tiltX={tiltX} tiltY={tiltY} size={640} />
        </div>
      )}
      {/* Mobile: ambient blueprint activity at low opacity, no labels, no dots */}
      {!isLg && (
        <div
          className="absolute pointer-events-none opacity-25"
          style={{
            right: "-80px",
            top: "24px",
            transformOrigin: "top right",
          }}
          aria-hidden="true"
        >
          <HeroJourney tiltX={tiltX} tiltY={tiltY} size={360} />
        </div>
      )}

      {/* Embers */}
      <EmberField />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-24 md:py-28">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        >
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-3"
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
          >
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: "var(--text-muted)" }}>
              Bureau d&apos;étude — Atelier — Pose
            </p>
            <span className="h-3 w-px hidden sm:inline-block" style={{ background: "var(--border-strong)" }} />
            <a
              href="tel:+33134058703"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--text)]"
              style={{ color: "var(--color-copper)" }}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              01 34 05 87 03
            </a>
          </motion.div>

          <h1
            className="font-display font-bold leading-[0.95] tracking-[-0.03em] sr-only-hidden"
            aria-label="L'art du métal, entre force et précision — IEF & CO"
          >
            {[
              { content: "L'art du métal,", className: "" },
              { content: "entre force", className: "text-gradient-metal" },
              { content: null, className: "" },
            ].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className={`block ${line.className}`}
                  style={{
                    fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                    color: line.className ? undefined : "var(--text)",
                    textWrap: "balance",
                  } as React.CSSProperties}
                  variants={{
                    hidden: { y: "100%" },
                    visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {line.content ?? (
                    <>
                      <span style={{ color: "var(--text-muted)" }}>&</span>{" "}
                      <motion.span
                        className="text-primary inline-block"
                        animate={ready ? { textShadow: ["0 0 30px rgba(225,16,33,0.25)", "0 0 80px rgba(225,16,33,0.5)", "0 0 30px rgba(225,16,33,0.25)"] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        précision
                      </motion.span>
                    </>
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-10 flex items-center gap-3"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } } }}
          >
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, var(--color-copper), transparent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
              EN 1090 · Eurocode 3
            </span>
          </motion.div>

          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed md:text-lg"
            style={{ color: "var(--text-secondary)" }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            Concepteur et fabricant de solutions métalliques sur mesure — de la
            conception à la pose, IEF & CO transforme le métal en performance durable.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          >
            <Button href="/services" size="lg">Découvrir nos services</Button>
            <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>Scroll</span>
          <div className="h-8 w-px" style={{ background: "linear-gradient(to bottom, var(--text-muted), transparent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
