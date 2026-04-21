"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useTime,
  useTransform,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from "motion/react";

/**
 * HeroJourney — THE unified Hero animation.
 *
 * ONE canvas. ONE continuous 20-second loop. FIVE cinematic acts that
 * tell the brand story on the same blueprint:
 *
 *   Act 1 · BUREAU   (0.5 → 5s)    Plan draws itself — grid, structure,
 *                                    dimension callouts, title block.
 *   Act 2 · ATELIER  (5 → 10.5s)   Welding torch visits each joint.
 *                                    Sparks fly from canvas. Welds glow red.
 *   Act 3 · POSE     (10.5 → 14s)  Panels drop elastically from above,
 *                                    slotting into the frame one by one.
 *   Act 4 · LIVRÉ    (14 → 17s)    Amber pulse propagates from joints.
 *                                    LIVRÉ rubber stamp lands with spring.
 *   Act 5 · REST     (17 → 20s)    Gentle iris dissolve. Loop.
 *
 * All element animations run via `useTime()` + `useTransform()` motion
 * values — DOM updates without React re-renders. Zero jank, GPU-accelerated.
 * React state is used ONLY for the phase label (updated every 300ms).
 */

interface Props {
  tiltX: ReturnType<typeof useSpring>;
  tiltY: ReturnType<typeof useSpring>;
  size?: number;
}

const CYCLE_MS = 20000;

type Phase = "bureau" | "atelier" | "pose" | "livre" | "rest";

const PHASE_LABELS: Record<Phase, string> = {
  bureau: "01 · Bureau d'étude",
  atelier: "02 · Atelier",
  pose: "03 · Pose chantier",
  livre: "04 · Livré",
  rest: "— Recommence",
};

/* Geometry */
const VB_W = 800;
const VB_H = 600;

const P = {
  leftCol: { x: 210, y: 180 },
  rightCol: { x: 590, y: 180 },
  ridge: { x: 400, y: 130 },
  baseY: 440,
};

const NODES = [
  { x: P.leftCol.x, y: P.leftCol.y, label: "A" },
  { x: P.ridge.x, y: P.ridge.y, label: "B" },
  { x: P.rightCol.x, y: P.rightCol.y, label: "C" },
  { x: P.rightCol.x, y: P.baseY, label: "D" },
  { x: P.leftCol.x, y: P.baseY, label: "E" },
];

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

/**
 * Helper — create a motion value that ramps from 0 → 1 between t=start and t=full,
 * stays at 1 until t=fadeStart, then drops to 0 at t=fadeEnd.
 */
function useTimedReveal(
  cycle: MotionValue<number>,
  start: number,
  full: number,
  fadeStart: number = 19000,
  fadeEnd: number = 20000
) {
  return useTransform(
    cycle,
    [0, start, full, fadeStart, fadeEnd],
    [0, 0, 1, 1, 0]
  );
}

export function HeroJourney({ tiltX, tiltY, size = 620 }: Props) {
  /* ─── Time-based motion values (no React re-renders) ─── */
  const time = useTime();
  const cycle = useTransform(time, (t) => t % CYCLE_MS);

  /* Tilt parallax */
  const rotateY = useTransform(tiltX, [-50, 50], [-2.5, 2.5]);
  const rotateX = useTransform(tiltY, [-50, 50], [1.5, -1.5]);

  /* ─── Phase label — low-frequency state update (300ms) ─── */
  const [phaseLabel, setPhaseLabel] = useState<Phase>("bureau");
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iv = window.setInterval(() => {
      const t = cycle.get();
      const p: Phase =
        t < 5000 ? "bureau" :
        t < 10500 ? "atelier" :
        t < 14000 ? "pose" :
        t < 17000 ? "livre" : "rest";
      setPhaseLabel((prev) => (prev === p ? prev : p));
    }, 300);
    return () => clearInterval(iv);
  }, [cycle]);

  /* Pause canvas/rAF when tab hidden or element offscreen */
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ─── Element reveals (all via motion values) ─── */

  // Chrome
  const gridOpacity = useTimedReveal(cycle, 200, 1000);
  const compassOp = useTimedReveal(cycle, 400, 1200);
  const titleBlockOp = useTimedReveal(cycle, 600, 1400);

  // Ground
  const groundLength = useTimedReveal(cycle, 1000, 1800);

  // Structure (progressive trace)
  const leftColLength = useTimedReveal(cycle, 1800, 2600);
  const rightColLength = useTimedReveal(cycle, 2000, 2800);
  const leftRafterLength = useTimedReveal(cycle, 2400, 3200);
  const rightRafterLength = useTimedReveal(cycle, 2600, 3400);
  const bracingOpL = useTimedReveal(cycle, 2800, 3400);
  const bracingOpR = useTimedReveal(cycle, 2900, 3500);
  const tieOp = useTimedReveal(cycle, 3000, 3600);

  // Pen head — a glowing dot that traces along the left column to signal "drawing"
  // It moves with the stroke reveal then disappears
  const penY = useTransform(cycle, [1800, 2600], [P.baseY, P.leftCol.y]);
  const penOpacity = useTransform(cycle, [1800, 1900, 2500, 2600], [0, 1, 1, 0]);

  // Dimensions
  const dimSpanOp = useTimedReveal(cycle, 3300, 4100);
  const dimHeightOp = useTimedReveal(cycle, 3700, 4500);
  const specsOp = useTimedReveal(cycle, 4000, 4800);

  // Amber pulse during livré phase
  const pulseScale = useTransform(cycle, [14000, 15500, 17000], [0.3, 2.4, 0.3]);
  const pulseOpacity = useTransform(cycle, [14000, 14500, 16500, 17000], [0, 0.6, 0, 0]);

  // LIVRÉ stamp — appears with delay + spring bounce
  const stampScale = useTransform(
    cycle,
    [14500, 14900, 15100, 17000, 17500],
    [0, 1.15, 1, 1, 0.8]
  );
  const stampOpacity = useTransform(
    cycle,
    [14500, 14900, 17000, 17500],
    [0, 1, 1, 0]
  );

  // Iris fade at end
  const irisOpacity = useTransform(cycle, [18500, 19500], [0, 1]);

  // Progress bar across the whole cycle
  const progressWidth = useTransform(cycle, [0, CYCLE_MS], ["0%", "100%"]);

  /* ─── Canvas for torch glow + sparks (atelier phase only) ─── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef(0);
  const lastSparkEmitRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const cssW = size;
    const cssH = (size * VB_H) / VB_W;
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
    }

    const tick = (now: number) => {
      if (!ctx || !canvas) return;
      const t = cycle.get();
      ctx.clearRect(0, 0, cssW, cssH);

      // Torch is only visible during atelier phase (5000→10500)
      const inAtelier = t >= 5000 && t < 10500;
      if (inAtelier) {
        const phaseT = (t - 5000) / 5500; // 0→1 through atelier
        const nodeIdx = Math.min(NODES.length - 1, Math.floor(phaseT * NODES.length));
        const n = NODES[nodeIdx];
        const gx = (n.x / VB_W) * cssW;
        const gy = (n.y / VB_H) * cssH;

        // Emit sparks
        if (now - lastSparkEmitRef.current > 55) {
          lastSparkEmitRef.current = now;
          for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.8;
            const speed = 1.2 + Math.random() * 3.5;
            sparksRef.current.push({
              x: gx,
              y: gy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 1.2,
              life: 1,
              size: 1.2 + Math.random() * 2.2,
            });
          }
          if (sparksRef.current.length > 140) {
            sparksRef.current = sparksRef.current.slice(-140);
          }
        }

        // Torch glow
        const glowR = 28;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.18, "rgba(255, 214, 138, 0.65)");
        grad.addColorStop(0.55, "rgba(232, 121, 43, 0.4)");
        grad.addColorStop(1, "rgba(232, 121, 43, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(gx - glowR, gy - glowR, glowR * 2, glowR * 2);

        // Bright core
        ctx.beginPath();
        ctx.arc(gx, gy, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Update & draw sparks
      sparksRef.current = sparksRef.current.filter((s) => {
        s.life -= 0.022;
        if (s.life <= 0) return false;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.13;
        s.vx *= 0.98;
        const alpha = s.life * 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${25 + (1 - s.life) * 22}, 92%, ${52 + s.life * 28}%, ${alpha})`;
        ctx.fill();
        return true;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cycle, paused, size]);

  const ink = "var(--blueprint-ink)";
  const inkSoft = "var(--blueprint-ink-soft)";
  const copper = "var(--color-copper)";
  const red = "var(--color-primary)";

  return (
    <motion.div
      ref={containerRef}
      className="relative pointer-events-none"
      style={{
        width: size,
        height: (size * VB_H) / VB_W,
        perspective: "1400px",
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width={size}
          height={(size * VB_H) / VB_W}
          style={{ overflow: "visible" }}
        >
          <defs>
            <pattern id="j-grid-mm" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={inkSoft} strokeWidth="0.4" opacity="0.4" />
            </pattern>
            <pattern id="j-grid-cm" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke={inkSoft} strokeWidth="0.7" opacity="0.55" />
            </pattern>
            <radialGradient id="pen-glow">
              <stop offset="0%" stopColor={copper} stopOpacity="1" />
              <stop offset="100%" stopColor={copper} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background grid */}
          <motion.g style={{ opacity: gridOpacity }}>
            <rect width={VB_W} height={VB_H} fill="url(#j-grid-mm)" />
            <rect width={VB_W} height={VB_H} fill="url(#j-grid-cm)" />
          </motion.g>

          {/* Compass top-left */}
          <motion.g transform="translate(50, 55)" style={{ opacity: compassOp }}>
            <circle cx="0" cy="0" r="13" fill="none" stroke={ink} strokeWidth="1.2" />
            <path d="M 0 -10 L 3 0 L 0 10 L -3 0 Z" fill={copper} />
            <text x="0" y="-20" fontSize="9" fontFamily="ui-monospace, monospace" fill={ink} textAnchor="middle" letterSpacing="2">N</text>
          </motion.g>

          {/* Title block top-right */}
          <motion.g transform="translate(560, 35)" style={{ opacity: titleBlockOp }}>
            <rect width="210" height="56" fill="var(--blueprint-paper)" fillOpacity="0.35" stroke={ink} strokeWidth="1.2" />
            <line x1="0" y1="22" x2="210" y2="22" stroke={ink} strokeWidth="0.8" />
            <line x1="130" y1="0" x2="130" y2="56" stroke={ink} strokeWidth="0.8" />
            <text x="8" y="15" fontSize="8.5" fontFamily="ui-monospace, monospace" fill={ink} letterSpacing="1.5">PROJ-IEF-2026</text>
            <text x="8" y="38" fontSize="11" fontFamily="ui-monospace, monospace" fill={ink} fontWeight="bold">PORTIQUE STRUCT.</text>
            <text x="8" y="50" fontSize="7.5" fontFamily="ui-monospace, monospace" fill={inkSoft}>EN 1090 • EXC2</text>
            <text x="138" y="15" fontSize="8.5" fontFamily="ui-monospace, monospace" fill={ink} letterSpacing="1.5">REV</text>
            <text x="138" y="38" fontSize="20" fontFamily="ui-monospace, monospace" fill={ink} fontWeight="bold">04</text>
            <text x="138" y="50" fontSize="7.5" fontFamily="ui-monospace, monospace" fill={inkSoft}>ECH 1:50</text>
          </motion.g>

          {/* Ground line with pathLength animation (draws left-to-right) */}
          <motion.line
            x1="120" y1={P.baseY} x2="680" y2={P.baseY}
            stroke={ink} strokeWidth="2.5" strokeLinecap="round"
            style={{ pathLength: groundLength, opacity: groundLength }}
          />

          {/* Ground hatching - sequential */}
          {Array.from({ length: 16 }).map((_, i) => {
            const startT = 1400 + i * 35;
            return (
              <HatchLine
                key={`gh${i}`}
                cycle={cycle}
                x1={140 + i * 35} y1={P.baseY}
                x2={120 + i * 35} y2={P.baseY + 22}
                startT={startT}
                color={inkSoft}
              />
            );
          })}

          {/* Pen head — glow dot that traces up the left column */}
          <motion.circle
            cx={P.leftCol.x}
            r="7"
            fill="url(#pen-glow)"
            style={{ cy: penY, opacity: penOpacity }}
          />
          <motion.circle
            cx={P.leftCol.x}
            r="2.5"
            fill={copper}
            style={{ cy: penY, opacity: penOpacity }}
          />

          {/* Structure — progressive trace with pathLength */}
          <motion.line
            x1={P.leftCol.x} y1={P.baseY}
            x2={P.leftCol.x} y2={P.leftCol.y}
            stroke={ink} strokeWidth="2.8" strokeLinecap="round"
            style={{ pathLength: leftColLength, opacity: leftColLength }}
          />
          <motion.line
            x1={P.rightCol.x} y1={P.baseY}
            x2={P.rightCol.x} y2={P.rightCol.y}
            stroke={ink} strokeWidth="2.8" strokeLinecap="round"
            style={{ pathLength: rightColLength, opacity: rightColLength }}
          />
          <motion.line
            x1={P.leftCol.x} y1={P.leftCol.y}
            x2={P.ridge.x} y2={P.ridge.y}
            stroke={ink} strokeWidth="2.8" strokeLinecap="round"
            style={{ pathLength: leftRafterLength, opacity: leftRafterLength }}
          />
          <motion.line
            x1={P.rightCol.x} y1={P.rightCol.y}
            x2={P.ridge.x} y2={P.ridge.y}
            stroke={ink} strokeWidth="2.8" strokeLinecap="round"
            style={{ pathLength: rightRafterLength, opacity: rightRafterLength }}
          />

          {/* Bracings */}
          <motion.line
            x1={P.leftCol.x} y1={P.leftCol.y + 30}
            x2={P.ridge.x - 50} y2={P.ridge.y + 25}
            stroke={inkSoft} strokeWidth="1.4"
            style={{ pathLength: bracingOpL, opacity: bracingOpL }}
          />
          <motion.line
            x1={P.rightCol.x} y1={P.rightCol.y + 30}
            x2={P.ridge.x + 50} y2={P.ridge.y + 25}
            stroke={inkSoft} strokeWidth="1.4"
            style={{ pathLength: bracingOpR, opacity: bracingOpR }}
          />
          <motion.line
            x1={P.leftCol.x} y1={P.leftCol.y}
            x2={P.rightCol.x} y2={P.rightCol.y}
            stroke={inkSoft} strokeWidth="1.4"
            style={{ pathLength: tieOp, opacity: tieOp }}
          />

          {/* Dimension: total span (top) */}
          <motion.g style={{ opacity: dimSpanOp }}>
            <line x1={P.leftCol.x} y1="95" x2={P.rightCol.x} y2="95" stroke={copper} strokeWidth="1.2" />
            <line x1={P.leftCol.x} y1="88" x2={P.leftCol.x} y2="120" stroke={copper} strokeWidth="1.2" />
            <line x1={P.rightCol.x} y1="88" x2={P.rightCol.x} y2="120" stroke={copper} strokeWidth="1.2" />
            <path d={`M ${P.leftCol.x + 6} 91 L ${P.leftCol.x} 95 L ${P.leftCol.x + 6} 99 Z`} fill={copper} />
            <path d={`M ${P.rightCol.x - 6} 91 L ${P.rightCol.x} 95 L ${P.rightCol.x - 6} 99 Z`} fill={copper} />
            <rect x="370" y="83" width="60" height="18" fill="var(--blueprint-paper)" />
            <text x="400" y="96" fontSize="13" fontFamily="ui-monospace, monospace" fill={copper} textAnchor="middle" fontWeight="bold">8000</text>
          </motion.g>

          {/* Dimension: height (right) */}
          <motion.g style={{ opacity: dimHeightOp }}>
            <line x1="705" y1={P.ridge.y} x2="705" y2={P.baseY} stroke={copper} strokeWidth="1.2" />
            <line x1="695" y1={P.ridge.y} x2="720" y2={P.ridge.y} stroke={copper} strokeWidth="1.2" />
            <line x1="695" y1={P.baseY} x2="720" y2={P.baseY} stroke={copper} strokeWidth="1.2" />
            <path d={`M 702 ${P.ridge.y + 6} L 705 ${P.ridge.y} L 708 ${P.ridge.y + 6} Z`} fill={copper} />
            <path d={`M 702 ${P.baseY - 6} L 705 ${P.baseY} L 708 ${P.baseY - 6} Z`} fill={copper} />
            <rect x="695" y={((P.ridge.y + P.baseY) / 2) - 9} width="36" height="18" fill="var(--blueprint-paper)" />
            <text x="713" y={(P.ridge.y + P.baseY) / 2 + 4} fontSize="13" fontFamily="ui-monospace, monospace" fill={copper} textAnchor="middle" fontWeight="bold">6000</text>
          </motion.g>

          {/* Node markers + weld marks */}
          {NODES.map((n, i) => (
            <NodeWithWeld
              key={`node-${i}`}
              cycle={cycle}
              node={n}
              index={i}
              pulseOpacity={pulseOpacity}
              pulseScale={pulseScale}
              ink={ink}
              red={red}
              copper={copper}
            />
          ))}

          {/* Panels sliding down */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Panel key={`panel-${i}`} cycle={cycle} index={i} ink={ink} copper={copper} />
          ))}

          {/* LIVRÉ stamp */}
          <motion.g
            transform="translate(400, 300)"
            style={{
              opacity: stampOpacity,
              scale: stampScale,
              rotate: -8,
              transformOrigin: "center",
            }}
          >
            <rect x="-90" y="-35" width="180" height="70" rx="5" fill="none" stroke={red} strokeWidth="3.5" />
            <rect x="-85" y="-30" width="170" height="60" rx="3" fill="none" stroke={red} strokeWidth="1.5" />
            <text
              x="0" y="7"
              fontSize="30"
              fontFamily="ui-monospace, monospace"
              fill={red}
              textAnchor="middle"
              fontWeight="bold"
              letterSpacing="5"
            >
              LIVRÉ
            </text>
            <text
              x="0" y="23"
              fontSize="8.5"
              fontFamily="ui-monospace, monospace"
              fill={red}
              textAnchor="middle"
              letterSpacing="2.5"
            >
              IEF & CO · RÉCEPTIONNÉ
            </text>
          </motion.g>

          {/* Specs cartouche */}
          <motion.g transform="translate(560, 500)" style={{ opacity: specsOp }}>
            <rect width="210" height="70" fill="var(--blueprint-paper)" fillOpacity="0.35" stroke={ink} strokeWidth="1.2" />
            <text x="8" y="14" fontSize="8" fontFamily="ui-monospace, monospace" fill={inkSoft} letterSpacing="1.5">SPECS</text>
            <line x1="0" y1="20" x2="210" y2="20" stroke={inkSoft} strokeWidth="0.6" />
            <text x="8" y="32" fontSize="8.5" fontFamily="ui-monospace, monospace" fill={ink}>STRUCT. ACIER S355</text>
            <text x="8" y="45" fontSize="8.5" fontFamily="ui-monospace, monospace" fill={ink}>MASSE · 2.8 t</text>
            <PhaseStatus cycle={cycle} />
          </motion.g>

          {/* Iris fade at end of cycle */}
          <motion.rect
            width={VB_W}
            height={VB_H}
            fill="var(--blueprint-paper)"
            style={{ opacity: irisOpacity }}
          />
        </svg>

        {/* Canvas overlay for torch + sparks */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>

      {/* Phase label */}
      <div className="absolute -top-1 right-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={phaseLabel}
            initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: copper }}
          >
            {PHASE_LABELS[phaseLabel]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Progress bar bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: "rgba(196, 133, 92, 0.15)" }}
      >
        <motion.div
          className="h-full"
          style={{
            width: progressWidth,
            background: "linear-gradient(90deg, var(--color-copper), var(--color-primary))",
          }}
        />
      </div>
    </motion.div>
  );
}

/* Individual node — empty circle + weld mark + amber pulse — each with its own transforms */
function NodeWithWeld({
  cycle,
  node,
  index,
  pulseOpacity,
  pulseScale,
  ink,
  red,
  copper,
}: {
  cycle: MotionValue<number>;
  node: { x: number; y: number };
  index: number;
  pulseOpacity: MotionValue<number>;
  pulseScale: MotionValue<number>;
  ink: string;
  red: string;
  copper: string;
}) {
  const baseOpacity = useTransform(
    cycle,
    [2100 + index * 120, 2600 + index * 120, 19000, 20000],
    [0, 1, 1, 0]
  );
  const nodeStart = 5000 + (index / NODES.length) * 5500 + 400;
  const nodeEnd = nodeStart + 400;
  const weldReveal = useTransform(cycle, [nodeStart, nodeEnd, 17500, 18000], [0, 1, 1, 0]);

  return (
    <g>
      <motion.circle
        cx={node.x}
        cy={node.y}
        r="4"
        fill="none"
        stroke={ink}
        strokeWidth="1.2"
        style={{ opacity: baseOpacity }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r="5.5"
        fill={red}
        style={{
          opacity: weldReveal,
          scale: weldReveal,
          transformOrigin: `${node.x}px ${node.y}px`,
        }}
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r="6"
        fill="none"
        stroke={copper}
        strokeWidth="2"
        style={{
          opacity: pulseOpacity,
          scale: pulseScale,
          transformOrigin: `${node.x}px ${node.y}px`,
        }}
      />
    </g>
  );
}

/* Individual panel dropping from above */
function Panel({
  cycle,
  index,
  ink,
  copper,
}: {
  cycle: MotionValue<number>;
  index: number;
  ink: string;
  copper: string;
}) {
  const start = 10500 + index * 600;
  const end = start + 600;
  const opacity = useTransform(cycle, [start, end, 17500, 18000], [0, 1, 1, 0]);
  const dropY = useTransform(cycle, [start, end], [-250, 0]);
  const scale = useTransform(cycle, [start, start + 300, end], [0.88, 1.06, 1]);

  const panelW = P.rightCol.x - P.leftCol.x - 20;
  const panelH = 58;
  const panelX = P.leftCol.x + 10;
  const panelYFinal = P.leftCol.y + 20 + index * panelH;

  return (
    <motion.g
      style={{
        opacity,
        y: dropY,
        scale,
        transformOrigin: `${panelX + panelW / 2}px ${panelYFinal}px`,
      }}
    >
      <rect
        x={panelX}
        y={panelYFinal}
        width={panelW}
        height={panelH - 4}
        fill={ink}
        fillOpacity="0.14"
        stroke={ink}
        strokeWidth="1.3"
      />
      <line
        x1={panelX + 8}
        y1={panelYFinal + (panelH - 4) / 2}
        x2={panelX + panelW - 8}
        y2={panelYFinal + (panelH - 4) / 2}
        stroke={ink}
        strokeWidth="0.6"
        opacity="0.7"
      />
      <text
        x={panelX + 10}
        y={panelYFinal + 15}
        fontSize="8"
        fontFamily="ui-monospace, monospace"
        fill={copper}
        opacity="0.75"
      >
        P{String(index + 1).padStart(2, "0")}
      </text>
    </motion.g>
  );
}

/* Ground hatching line — individual component so each can use its own useTransform */
function HatchLine({
  cycle,
  x1, y1, x2, y2,
  startT,
  color,
}: {
  cycle: MotionValue<number>;
  x1: number; y1: number; x2: number; y2: number;
  startT: number;
  color: string;
}) {
  const opacity = useTransform(cycle, [startT, startT + 300, 19000, 19800], [0, 0.9, 0.9, 0]);
  return <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.7" style={{ opacity }} />;
}

/* Phase status text — updates live via motion value transform on text */
function PhaseStatus({ cycle }: { cycle: MotionValue<number> }) {
  const [status, setStatus] = useState("ÉTUDE");
  const [color, setColor] = useState("var(--blueprint-ink)");
  useEffect(() => {
    const iv = setInterval(() => {
      const t = cycle.get();
      if (t < 5000) {
        setStatus("ÉTUDE");
        setColor("var(--blueprint-ink)");
      } else if (t < 10500) {
        setStatus("ATELIER");
        setColor("var(--color-primary)");
      } else if (t < 14000) {
        setStatus("POSE");
        setColor("var(--color-copper)");
      } else if (t < 17500) {
        setStatus("RÉCEPTIONNÉ");
        setColor("var(--color-copper)");
      } else {
        setStatus("—");
        setColor("var(--blueprint-ink-soft)");
      }
    }, 200);
    return () => clearInterval(iv);
  }, [cycle]);

  return (
    <text
      x="8"
      y="58"
      fontSize="8.5"
      fontFamily="ui-monospace, monospace"
      fill={color}
      style={{ transition: "fill 0.3s ease" }}
    >
      {status}
    </text>
  );
}
