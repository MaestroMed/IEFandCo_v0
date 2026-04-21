"use client";

import { motion, useReducedMotion } from "motion/react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * CADIllustration
 *
 * An isometric engineering drawing of a steel truss / portal frame, designed
 * to read as a real CAD export — title block, hatched supports, dimension
 * lines with arrowheads, callouts, section markers, and a blueprint grid.
 *
 * The dimension annotations animate in sequentially to suggest a designer
 * laying out the drawing in real time.
 *
 * Width 100%, aspect ratio 4:3, light/dark aware via CSS vars.
 */

interface CADIllustrationProps {
  className?: string;
  ariaLabel?: string;
}

const VB_W = 800;
const VB_H = 600;

/* ───────────────── Helpers ───────────────── */

function ArrowHead({
  x,
  y,
  rotate = 0,
  color = "currentColor",
}: {
  x: number;
  y: number;
  rotate?: number;
  color?: string;
}) {
  return (
    <path
      d="M 0 0 L -8 -3.5 L -8 3.5 Z"
      fill={color}
      transform={`translate(${x} ${y}) rotate(${rotate})`}
    />
  );
}

interface DimensionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  delay?: number;
  /** "above" | "below" | "left" | "right" relative to the measured line */
  side?: "above" | "below" | "left" | "right";
  offset?: number;
  inView: boolean;
}

function Dimension({
  x1,
  y1,
  x2,
  y2,
  label,
  delay = 0,
  side = "above",
  offset = 28,
  inView,
}: DimensionProps) {
  const horizontal = Math.abs(y1 - y2) < 0.5;
  const vertical = Math.abs(x1 - x2) < 0.5;

  let ox1 = x1;
  let oy1 = y1;
  let ox2 = x2;
  let oy2 = y2;

  if (horizontal) {
    const dy = side === "below" ? offset : -offset;
    oy1 = y1 + dy;
    oy2 = y2 + dy;
  } else if (vertical) {
    const dx = side === "right" ? offset : -offset;
    ox1 = x1 + dx;
    ox2 = x2 + dx;
  } else {
    // Angled — perpendicular offset
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    const sign = side === "above" || side === "left" ? -1 : 1;
    ox1 = x1 + nx * offset * sign;
    oy1 = y1 + ny * offset * sign;
    ox2 = x2 + nx * offset * sign;
    oy2 = y2 + ny * offset * sign;
  }

  const angle = Math.atan2(oy2 - oy1, ox2 - ox1) * (180 / Math.PI);
  const mx = (ox1 + ox2) / 2;
  const my = (oy1 + oy2) / 2;

  return (
    <motion.g
      style={{ color: "var(--color-copper)" }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay, duration: 0.45 }}
    >
      {/* Extension lines */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={ox1}
        y2={oy1}
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="3 3"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay, duration: 0.4 }}
      />
      <motion.line
        x1={x2}
        y1={y2}
        x2={ox2}
        y2={oy2}
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="3 3"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: delay + 0.05, duration: 0.4 }}
      />

      {/* Main dimension line */}
      <motion.line
        x1={ox1}
        y1={oy1}
        x2={ox2}
        y2={oy2}
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ delay: delay + 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Arrowheads */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: delay + 0.65 }}
      >
        <ArrowHead x={ox1} y={oy1} rotate={angle + 180} />
        <ArrowHead x={ox2} y={oy2} rotate={angle} />
      </motion.g>

      {/* Label chip */}
      <motion.g
        transform={`translate(${mx} ${my}) rotate(${horizontal ? 0 : angle})`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: delay + 0.7, duration: 0.35 }}
      >
        <rect
          x={-(label.length * 4 + 8)}
          y="-9"
          width={label.length * 8 + 16}
          height="18"
          fill="var(--bg-muted)"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.95"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.1em"
          fill="currentColor"
        >
          {label}
        </text>
      </motion.g>
    </motion.g>
  );
}

function SectionMarker({
  x,
  y,
  label,
  delay,
  inView,
}: {
  x: number;
  y: number;
  label: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <circle
        cx={x}
        cy={y}
        r="14"
        fill="var(--bg-surface)"
        stroke="var(--color-primary)"
        strokeWidth="1.4"
      />
      <line
        x1={x - 14}
        y1={y}
        x2={x + 14}
        y2={y}
        stroke="var(--color-primary)"
        strokeWidth="0.6"
        opacity="0.6"
      />
      <text
        x={x}
        y={y - 2}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.1em"
        fill="var(--color-primary)"
      >
        A
      </text>
      <text
        x={x}
        y={y + 9}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.1em"
        fill="var(--color-primary)"
      >
        A
      </text>
      <text
        x={x + 22}
        y={y + 4}
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.1em"
        fill="var(--color-primary)"
      >
        {label}
      </text>
    </motion.g>
  );
}

function HatchedSupport({
  x,
  y,
  width,
  height,
  delay,
  inView,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <line
        x1={x - 4}
        y1={y}
        x2={x + width + 4}
        y2={y}
        stroke="var(--text)"
        strokeWidth="1.5"
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={x + 2 + i * (width / 7)}
          y1={y}
          x2={x - 2 + i * (width / 7)}
          y2={y + height}
          stroke="var(--text)"
          strokeWidth="0.7"
          opacity="0.8"
        />
      ))}
    </motion.g>
  );
}

/* ───────────────── Drawing ───────────────── */

export function CADIllustration({ className, ariaLabel }: CADIllustrationProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: "-40px",
  });
  const reduced = useReducedMotion();

  // Isometric projection helper
  // X axis goes right-down at 30deg, Y axis goes left-down at 30deg, Z is up.
  const ORIGIN_X = 360;
  const ORIGIN_Y = 380;
  const ANG = (Math.PI / 180) * 30;
  const COS = Math.cos(ANG);
  const SIN = Math.sin(ANG);

  const iso = (x: number, y: number, z: number) => ({
    x: ORIGIN_X + (x - y) * COS,
    y: ORIGIN_Y + (x + y) * SIN - z,
  });

  // Truss dimensions (model space)
  const WIDTH = 280; // span
  const DEPTH = 90;
  const HEIGHT = 60; // bottom chord clearance from ground
  const TOP_RISE = 80; // top chord apex height above bottom chord

  // Bottom chord corners
  const A = iso(0, 0, HEIGHT);
  const B = iso(WIDTH, 0, HEIGHT);
  const C = iso(WIDTH, DEPTH, HEIGHT);
  const D = iso(0, DEPTH, HEIGHT);

  // Apex points (top chord, ridge)
  const TopA = iso(WIDTH / 2, 0, HEIGHT + TOP_RISE);
  const TopB = iso(WIDTH / 2, DEPTH, HEIGHT + TOP_RISE);

  // Quarter-span points (for diagonals)
  const Q1 = iso(WIDTH / 4, 0, HEIGHT + TOP_RISE / 2);
  const Q2 = iso((WIDTH * 3) / 4, 0, HEIGHT + TOP_RISE / 2);

  // Bottom chord nodes (for verticals)
  const N1 = iso(WIDTH / 4, 0, HEIGHT);
  const N2 = iso(WIDTH / 2, 0, HEIGHT);
  const N3 = iso((WIDTH * 3) / 4, 0, HEIGHT);

  // Ground points
  const G1 = iso(0, 0, 0);
  const G2 = iso(WIDTH, 0, 0);
  const G3 = iso(WIDTH, DEPTH, 0);
  const G4 = iso(0, DEPTH, 0);

  // Animation gating: when the user prefers reduced motion, skip drawing
  // animations and render statically.
  const animate = !reduced;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        className
      )}
      style={{
        background: "var(--bg-muted)",
        border: "1px solid var(--border)",
        aspectRatio: "4/3",
      }}
      role="img"
      aria-label={ariaLabel ?? "Vue isometrique CAD d'une charpente metallique avec cotation"}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Definitions ── */}
        <defs>
          <pattern
            id="cad-grid-fine"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.16"
            />
          </pattern>
          <pattern
            id="cad-grid-major"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.28"
            />
          </pattern>
          <radialGradient id="cad-vignette" cx="50%" cy="50%" r="80%">
            <stop offset="40%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </radialGradient>
          <linearGradient id="cad-copper-tint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Background grid ── */}
        <rect width={VB_W} height={VB_H} fill="var(--bg-muted)" />
        <g style={{ color: "var(--text-muted)" }}>
          <rect width={VB_W} height={VB_H} fill="url(#cad-grid-fine)" />
          <rect width={VB_W} height={VB_H} fill="url(#cad-grid-major)" />
        </g>
        <g style={{ color: "var(--color-copper)" }}>
          <rect width={VB_W} height={VB_H} fill="url(#cad-copper-tint)" />
        </g>
        <rect width={VB_W} height={VB_H} fill="url(#cad-vignette)" />

        {/* ── Drawing frame & corner brackets ── */}
        <g style={{ color: "var(--text-muted)" }}>
          <rect
            x="14"
            y="14"
            width={VB_W - 28}
            height={VB_H - 28}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
          />
          <rect
            x="22"
            y="22"
            width={VB_W - 44}
            height={VB_H - 44}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.3"
          />
          {/* Corner ticks */}
          {[
            { x: 22, y: 22, d: "M 0 12 L 0 0 L 12 0" },
            { x: VB_W - 22, y: 22, d: "M -12 0 L 0 0 L 0 12" },
            { x: 22, y: VB_H - 22, d: "M 0 -12 L 0 0 L 12 0" },
            { x: VB_W - 22, y: VB_H - 22, d: "M 0 -12 L 0 0 L -12 0" },
          ].map((c, i) => (
            <path
              key={i}
              d={c.d}
              transform={`translate(${c.x} ${c.y})`}
              fill="none"
              stroke="var(--color-copper)"
              strokeWidth="1.6"
            />
          ))}
        </g>

        {/* ── Top-left header ── */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.6 }}
        >
          <rect
            x="36"
            y="36"
            width="170"
            height="48"
            fill="var(--bg-surface)"
            stroke="var(--border-strong)"
            strokeWidth="0.8"
            rx="2"
          />
          <line
            x1="36"
            y1="60"
            x2="206"
            y2="60"
            stroke="var(--border)"
            strokeWidth="0.6"
          />
          <text
            x="46"
            y="54"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.16em"
            fill="var(--color-copper)"
          >
            CHARPENTE-001
          </text>
          <text
            x="46"
            y="74"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            letterSpacing="0.15em"
            fill="var(--text-secondary)"
          >
            ECH 1:20 — VUE ISO
          </text>
        </motion.g>

        {/* ── Title block (bottom-right) ── */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <rect
            x={VB_W - 220}
            y={VB_H - 92}
            width="184"
            height="56"
            fill="var(--bg-surface)"
            stroke="var(--border-strong)"
            strokeWidth="0.8"
          />
          <line
            x1={VB_W - 220}
            y1={VB_H - 70}
            x2={VB_W - 36}
            y2={VB_H - 70}
            stroke="var(--border)"
            strokeWidth="0.6"
          />
          <line
            x1={VB_W - 130}
            y1={VB_H - 70}
            x2={VB_W - 130}
            y2={VB_H - 36}
            stroke="var(--border)"
            strokeWidth="0.6"
          />
          <text
            x={VB_W - 212}
            y={VB_H - 78}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            letterSpacing="0.16em"
            fill="var(--text-muted)"
          >
            BUREAU D&apos;ETUDE
          </text>
          <text
            x={VB_W - 212}
            y={VB_H - 56}
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            fontWeight="700"
            letterSpacing="0.14em"
            fill="var(--color-copper)"
          >
            IEF & CO
          </text>
          <text
            x={VB_W - 212}
            y={VB_H - 42}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            letterSpacing="0.1em"
            fill="var(--text-secondary)"
          >
            EN 1090 · EC3
          </text>
          <text
            x={VB_W - 122}
            y={VB_H - 56}
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            letterSpacing="0.14em"
            fill="var(--text)"
          >
            REV 03
          </text>
          <text
            x={VB_W - 122}
            y={VB_H - 42}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            letterSpacing="0.1em"
            fill="var(--text-muted)"
          >
            2026-04-19
          </text>
        </motion.g>

        {/* ── Ground plane (isometric) ── */}
        <motion.g
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <polygon
            points={`${G1.x},${G1.y} ${G2.x},${G2.y} ${G3.x},${G3.y} ${G4.x},${G4.y}`}
            fill="currentColor"
            opacity="0.06"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />
          {/* Ground hatching */}
          {Array.from({ length: 12 }).map((_, i) => {
            const t = i / 12;
            const start = iso(WIDTH * t, 0, 0);
            const end = iso(WIDTH * t, DEPTH, 0);
            return (
              <line
                key={i}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.35"
              />
            );
          })}
        </motion.g>

        {/* ── Hatched supports under columns ── */}
        <HatchedSupport x={A.x - 18} y={A.y + 16} width={36} height={10} delay={animate ? 0.4 : 0} inView={inView} />
        <HatchedSupport x={B.x - 18} y={B.y + 16} width={36} height={10} delay={animate ? 0.45 : 0} inView={inView} />

        {/* ── Columns (from ground to bottom chord) ── */}
        <g style={{ color: "var(--text)" }}>
          {[
            { from: G1, to: A, delay: 0.5 },
            { from: G2, to: B, delay: 0.55 },
            { from: G3, to: C, delay: 0.6 },
            { from: G4, to: D, delay: 0.65 },
          ].map((col, i) => (
            <motion.line
              key={i}
              x1={col.from.x}
              y1={col.from.y}
              x2={col.to.x}
              y2={col.to.y}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{
                delay: animate ? col.delay : 0,
                duration: animate ? 0.8 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </g>

        {/* ── Bottom chord (perimeter at clearance) ── */}
        <g style={{ color: "var(--text)" }}>
          <motion.path
            d={`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} L ${D.x} ${D.y} Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              delay: animate ? 0.85 : 0,
              duration: animate ? 1.1 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </g>

        {/* ── Top chord / ridge (gable) ── */}
        <g style={{ color: "var(--text)" }}>
          <motion.path
            d={`M ${A.x} ${A.y} L ${TopA.x} ${TopA.y} L ${B.x} ${B.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              delay: animate ? 1.05 : 0,
              duration: animate ? 1 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          <motion.path
            d={`M ${D.x} ${D.y} L ${TopB.x} ${TopB.y} L ${C.x} ${C.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            opacity="0.85"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              delay: animate ? 1.15 : 0,
              duration: animate ? 1 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          {/* Ridge connector */}
          <motion.line
            x1={TopA.x}
            y1={TopA.y}
            x2={TopB.x}
            y2={TopB.y}
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.85"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              delay: animate ? 1.25 : 0,
              duration: animate ? 0.7 : 0,
            }}
          />
        </g>

        {/* ── Web members (truss diagonals + verticals on front face) ── */}
        <g style={{ color: "var(--color-copper)" }}>
          {[
            // Verticals from bottom chord to apex line
            { x1: N1.x, y1: N1.y, x2: Q1.x, y2: Q1.y, delay: 1.35 },
            { x1: N2.x, y1: N2.y, x2: TopA.x, y2: TopA.y, delay: 1.4 },
            { x1: N3.x, y1: N3.y, x2: Q2.x, y2: Q2.y, delay: 1.45 },
            // Diagonals
            { x1: A.x, y1: A.y, x2: Q1.x, y2: Q1.y, delay: 1.5 },
            { x1: Q1.x, y1: Q1.y, x2: N2.x, y2: N2.y, delay: 1.55 },
            { x1: N2.x, y1: N2.y, x2: Q2.x, y2: Q2.y, delay: 1.6 },
            { x1: Q2.x, y1: Q2.y, x2: B.x, y2: B.y, delay: 1.65 },
            // Top chord rises through Q1 / Q2 (purlin marks)
            { x1: Q1.x, y1: Q1.y, x2: TopA.x, y2: TopA.y, delay: 1.7 },
            { x1: TopA.x, y1: TopA.y, x2: Q2.x, y2: Q2.y, delay: 1.75 },
          ].map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.92"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{
                delay: animate ? line.delay : 0,
                duration: animate ? 0.45 : 0,
                ease: "easeOut",
              }}
            />
          ))}
        </g>

        {/* ── Welds at key nodes ── */}
        <g>
          {[
            { p: A, delay: 1.8 },
            { p: B, delay: 1.85 },
            { p: TopA, delay: 1.9 },
            { p: N2, delay: 1.95 },
          ].map((w, i) => (
            <motion.circle
              key={i}
              cx={w.p.x}
              cy={w.p.y}
              r="3.4"
              fill="var(--color-primary)"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{
                delay: animate ? w.delay : 0,
                type: "spring",
                stiffness: 240,
                damping: 18,
              }}
            />
          ))}
        </g>

        {/* ── Section marker A-A ── */}
        <SectionMarker x={N2.x + 32} y={N2.y - 6} label="SECTION A-A" delay={animate ? 2.05 : 0} inView={inView} />

        {/* ── Dimensions ── */}
        {/* Span (bottom chord, front face — placed below the structure) */}
        <Dimension
          x1={A.x}
          y1={A.y}
          x2={B.x}
          y2={B.y}
          label="L=3200 mm"
          delay={animate ? 2.15 : 0}
          side="below"
          offset={68}
          inView={inView}
        />
        {/* Height (left column) */}
        <Dimension
          x1={G1.x}
          y1={G1.y}
          x2={A.x}
          y2={A.y}
          label="H=2400"
          delay={animate ? 2.35 : 0}
          side="left"
          offset={64}
          inView={inView}
        />
        {/* Apex rise (vertical through center) */}
        <Dimension
          x1={N2.x}
          y1={N2.y}
          x2={TopA.x}
          y2={TopA.y}
          label="800 mm"
          delay={animate ? 2.55 : 0}
          side="right"
          offset={88}
          inView={inView}
        />

        {/* ── North arrow / scale legend ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: animate ? 2.7 : 0, duration: 0.5 }}
        >
          <g transform={`translate(${VB_W - 80} 60)`}>
            <circle cx="0" cy="0" r="20" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="0.8" />
            <path
              d="M 0 -14 L 4 6 L 0 2 L -4 6 Z"
              fill="var(--color-copper)"
            />
            <text
              x="0"
              y="-22"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              letterSpacing="0.15em"
              fill="var(--text-muted)"
            >
              N
            </text>
          </g>
        </motion.g>

        {/* ── Material callout ── */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ delay: animate ? 2.4 : 0, duration: 0.5 }}
        >
          <line
            x1={TopA.x}
            y1={TopA.y - 8}
            x2={TopA.x + 70}
            y2={TopA.y - 60}
            stroke="var(--color-primary)"
            strokeWidth="0.8"
          />
          <circle cx={TopA.x} cy={TopA.y - 8} r="2.5" fill="var(--color-primary)" />
          <rect
            x={TopA.x + 70}
            y={TopA.y - 78}
            width="106"
            height="36"
            fill="var(--bg-surface)"
            stroke="var(--color-primary)"
            strokeWidth="0.8"
            rx="2"
          />
          <text
            x={TopA.x + 78}
            y={TopA.y - 64}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fontWeight="700"
            letterSpacing="0.14em"
            fill="var(--color-primary)"
          >
            PROFILE IPE 200
          </text>
          <text
            x={TopA.x + 78}
            y={TopA.y - 50}
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            letterSpacing="0.12em"
            fill="var(--text-secondary)"
          >
            ACIER S355 J2
          </text>
        </motion.g>

        {/* ── Subtle scan-line shimmer for "live" CAD feel ── */}
        {!reduced && (
          <motion.line
            x1="0"
            y1="0"
            x2={VB_W}
            y2="0"
            stroke="var(--color-copper)"
            strokeWidth="1.2"
            opacity="0.18"
            initial={{ y: -10 }}
            animate={inView ? { y: [VB_H + 10, -10] } : { y: -10 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
              delay: 3.2,
            }}
          />
        )}
      </svg>

      {/* Floating dimension annotation in the corner like the hero */}
      <motion.div
        className="pointer-events-none absolute right-4 top-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
          ISO-VIEW
        </span>
        <span className="h-px w-6" style={{ background: "var(--color-copper)" }} />
      </motion.div>
    </div>
  );
}

export default CADIllustration;
