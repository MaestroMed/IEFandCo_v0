"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ProjectIllustration,
  PROJECT_ILLUSTRATION_KEYS,
} from "@/components/ui/ProjectIllustration";

/**
 * HeroServiceCarousel — the hand-drawn heart of the homepage hero.
 *
 * Cycles through the seven blueprint illustrations (one per service family),
 * each held for ~6 seconds, with:
 *   - a cinematic crossfade between scenes (scale + blur + opacity)
 *   - an animated copper→accent tint shift that syncs with the drawing
 *   - a scene counter + title block in technical "drafting" style
 *   - a subtle progress bar showing the current scene's lifespan
 *   - a light parallax tilt driven by HeroSection's mouse-tracked spring
 *
 * Accessibility:
 *   - `prefers-reduced-motion`: freezes on the first scene, no auto-cycle,
 *     gives users arrow-key navigation to step through drawings manually.
 *   - Pause on hover/focus for visitors who want to study a drawing.
 *   - Full aria-label, role="region", live status for active scene name.
 */

interface Scene {
  key: (typeof PROJECT_ILLUSTRATION_KEYS)[number];
  title: string;
  subtitle: string;
  /** RGB triplet aligned with data/services.ts accentColor values */
  accent: string;
}

const SCENES: Scene[] = [
  {
    key: "industrielles",
    title: "Fermetures industrielles",
    subtitle: "Porte sectionnelle — rail haut",
    accent: "59, 130, 180", // steel blue
  },
  {
    key: "portails",
    title: "Portails & clôtures",
    subtitle: "Portail coulissant — rail inox",
    accent: "166, 124, 82", // warm earth
  },
  {
    key: "structures",
    title: "Structures métalliques",
    subtitle: "Charpente isométrique — S355",
    accent: "160, 170, 180", // chrome
  },
  {
    key: "menuiserie",
    title: "Menuiserie & vitrerie",
    subtitle: "Mur-rideau VEC — trame 1200",
    accent: "100, 180, 200", // glass cyan
  },
  {
    key: "coupe-feu",
    title: "Portes coupe-feu",
    subtitle: "Porte EI 60 — battant acier",
    accent: "200, 120, 50", // amber
  },
  {
    key: "automatismes",
    title: "Automatismes",
    subtitle: "Motorisation tubulaire 24V",
    accent: "80, 120, 220", // electric blue
  },
  {
    key: "maintenance",
    title: "Maintenance préventive",
    subtitle: "Plan annuel — 4 visites",
    accent: "60, 170, 140", // teal
  },
];

const SCENE_DURATION_MS = 6000;
const TRANSITION_MS = 900;

interface Props {
  tiltX?: ReturnType<typeof useSpring>;
  tiltY?: ReturnType<typeof useSpring>;
  size?: number;
}

export function HeroServiceCarousel({ tiltX, tiltY, size = 620 }: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-cycle. Restarts whenever `index` changes so that pausing/resuming
  // gets a full remaining lifetime on the current scene.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % SCENES.length);
    }, SCENE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, reduceMotion]);

  // Keyboard control — arrow keys step through scenes. Only active when
  // the carousel has focus (keeps page-scroll arrow-key behaviour intact).
  const rootRef = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex((i) => (i + 1) % SCENES.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex((i) => (i - 1 + SCENES.length) % SCENES.length);
    }
  };

  const scene = SCENES[index];

  // Parallax — only if tilt springs are wired from HeroSection.
  // Must call hooks unconditionally; guard at the style level instead.
  const fallbackX = useSpring(0);
  const fallbackY = useSpring(0);
  const x = useTransform(tiltX ?? fallbackX, [-50, 50], [8, -8]);
  const y = useTransform(tiltY ?? fallbackY, [-50, 50], [6, -6]);

  // Progress bar — simple CSS-driven animation, restarts on index change.
  const progressKey = `${index}-${paused ? "p" : "r"}`;

  const content = useMemo(
    () => (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene.key}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{
            duration: TRANSITION_MS / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ProjectIllustration
            category={scene.key}
            accentColor={scene.accent}
            hideTitle
            animKey={scene.key}
            className="w-full shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      </AnimatePresence>
    ),
    [scene.key, scene.accent]
  );

  return (
    <div
      ref={rootRef}
      className="relative select-none"
      style={{ width: size, height: (size * 3) / 4 }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Illustrations techniques des 7 familles de services IEF & CO"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Accent glow that cross-fades with the scene */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`glow-${scene.key}`}
          className="absolute -inset-12 pointer-events-none -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${scene.accent}, 0.18) 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Parallax inner wrapper */}
      <motion.div
        className="relative h-full w-full"
        style={tiltX && tiltY ? { x, y } : undefined}
      >
        {/* Drafting frame with live scene label */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col">
          {/* Top bar: counter · scene title · technical reference */}
          <div
            className="flex items-center justify-between px-5 pt-4 text-[10px] font-mono uppercase tracking-[0.25em]"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-px w-6"
                style={{ background: `rgb(${scene.accent})` }}
              />
              <span style={{ color: `rgb(${scene.accent})` }}>
                {String(index + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
              </span>
            </div>
            <span className="hidden md:inline">IEF-CO · REV.03 · ECH 1:100</span>
          </div>

          {/* Bottom: title + subtitle */}
          <div className="mt-auto px-5 pb-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${scene.key}`}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: `rgb(${scene.accent})` }}
                >
                  {scene.subtitle}
                </div>
                <div
                  className="mt-1 font-display text-lg font-semibold md:text-xl"
                  style={{ color: "var(--text)" }}
                >
                  {scene.title}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress strip */}
            <div
              className="mt-4 h-px w-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              {!reduceMotion && !paused ? (
                <div
                  key={progressKey}
                  className="h-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgb(${scene.accent}))`,
                    animation: `hero-scene-progress ${SCENE_DURATION_MS}ms linear forwards`,
                  }}
                />
              ) : (
                <div
                  className="h-full w-1/12"
                  style={{ background: `rgb(${scene.accent})` }}
                />
              )}
            </div>

            {/* Scene dots */}
            <div
              className="mt-4 flex items-center gap-2"
              role="tablist"
              aria-label="Sélectionner une scène"
            >
              {SCENES.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Afficher la scène ${i + 1} sur ${SCENES.length} — ${s.title}`}
                    onClick={() => setIndex(i)}
                    className="pointer-events-auto transition-all"
                    style={{
                      width: active ? 28 : 10,
                      height: 3,
                      borderRadius: 2,
                      background: active
                        ? `rgb(${s.accent})`
                        : "rgba(255,255,255,0.18)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* The drawing itself */}
        {content}
      </motion.div>

      <span
        className="sr-only"
        aria-live="polite"
      >
        {scene.title} — scène {index + 1} sur {SCENES.length}
      </span>
    </div>
  );
}
