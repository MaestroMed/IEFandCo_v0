"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ProjectIllustration
 *
 * Technical, blueprint-style SVG illustrations for each metalwork category.
 * Each illustration is hand-crafted to recognizably represent the actual product
 * family — an architect's elevation/section, not a generic icon.
 *
 * Aesthetic:
 *  - Dark steel line work on a subtle grid background (pattern: blueprint-grid)
 *  - Copper accent highlights on key structural elements
 *  - IEF red used sparingly for hotspots (welds, rating marks)
 *  - Monospace dimension annotations in the brand's technical style
 *  - Inline CSS vars so the drawing reflows for light/dark modes
 */

export type ProjectCategory =
  | "structures"
  | "portails"
  | "industrielles"
  | "menuiserie"
  | "coupe-feu"
  | "automatismes"
  | "maintenance";

interface ProjectIllustrationProps {
  category: string;
  className?: string;
  title?: string;
  /**
   * RGB triplet ("R, G, B") to override the copper accent for this specific
   * instance — lets each service hero match its own accentColor, and lets
   * HeroServiceCarousel crossfade accent tones per scene.
   */
  accentColor?: string;
  /** Hide the top-left title chip when embedded in a frame that has its own label. */
  hideTitle?: boolean;
  /**
   * When provided, remounts the drawing on every change to replay entry animations.
   * Used by HeroServiceCarousel when cycling scenes.
   */
  animKey?: string | number;
}

const ANIM = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
};

const VIEWBOX_W = 480;
const VIEWBOX_H = 360;

/* ──────────────────────────────────────────────────────────
   Shared subcomponents
   ────────────────────────────────────────────────────────── */

function BlueprintGrid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern
          id={`grid-${id}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.18"
          />
        </pattern>
        <pattern
          id={`grid-major-${id}`}
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.3"
          />
        </pattern>
        <linearGradient
          id={`fade-${id}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="var(--bg-muted)"
      />
      <g style={{ color: "var(--text-muted)" }}>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
        <rect width="100%" height="100%" fill={`url(#grid-major-${id})`} />
      </g>
      <rect
        width="100%"
        height="100%"
        fill={`url(#fade-${id})`}
        style={{ color: "var(--color-copper)" }}
      />
    </>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <g style={{ color: "var(--text-muted)" }}>
      <rect
        x="8"
        y="8"
        width={VIEWBOX_W - 16}
        height={VIEWBOX_H - 16}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <rect
        x="14"
        y="14"
        width={VIEWBOX_W - 28}
        height={VIEWBOX_H - 28}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.25"
      />
      {/* Corner brackets */}
      {[
        { x: 14, y: 14, d: "M 0 8 L 0 0 L 8 0" },
        { x: VIEWBOX_W - 14, y: 14, d: "M -8 0 L 0 0 L 0 8" },
        { x: 14, y: VIEWBOX_H - 14, d: "M 0 -8 L 0 0 L 8 0" },
        { x: VIEWBOX_W - 14, y: VIEWBOX_H - 14, d: "M 0 -8 L 0 0 L -8 0" },
      ].map((c, i) => (
        <path
          key={i}
          d={c.d}
          transform={`translate(${c.x} ${c.y})`}
          fill="none"
          stroke="var(--color-copper)"
          strokeWidth="1.25"
        />
      ))}
      {/* Title block (bottom-right) */}
      <g transform={`translate(${VIEWBOX_W - 120} ${VIEWBOX_H - 36})`}>
        <rect
          x="0"
          y="0"
          width="106"
          height="22"
          fill="var(--bg-surface)"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.85"
        />
        <line
          x1="52"
          y1="0"
          x2="52"
          y2="22"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <text
          x="6"
          y="14"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.1em"
          fill="var(--color-copper)"
        >
          IEF-CO
        </text>
        <text
          x="58"
          y="14"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.08em"
          fill="var(--text-secondary)"
        >
          REV.03
        </text>
      </g>
      {children}
    </g>
  );
}

/**
 * Dimension line with arrowheads and centered label.
 * Animates in on mount.
 */
function Dim({
  x1,
  y1,
  x2,
  y2,
  label,
  delay = 0,
  above = true,
  offset = 18,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  delay?: number;
  above?: boolean;
  offset?: number;
}) {
  const horizontal = y1 === y2;
  const vertical = x1 === x2;
  const sign = above ? -1 : 1;

  // Offset line in perpendicular direction
  const ox1 = horizontal ? x1 : x1 + sign * offset;
  const oy1 = horizontal ? y1 + sign * offset : y1;
  const ox2 = horizontal ? x2 : x2 + sign * offset;
  const oy2 = horizontal ? y2 + sign * offset : y2;

  const mx = (ox1 + ox2) / 2;
  const my = (oy1 + oy2) / 2;
  const angle = Math.atan2(oy2 - oy1, ox2 - ox1) * (180 / Math.PI);

  return (
    <motion.g
      style={{ color: "var(--color-copper)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Extension lines */}
      <line
        x1={x1}
        y1={y1}
        x2={ox1}
        y2={oy1}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      <line
        x1={x2}
        y1={y2}
        x2={ox2}
        y2={oy2}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      {/* Main dimension line */}
      <motion.line
        x1={ox1}
        y1={oy1}
        x2={ox2}
        y2={oy2}
        stroke="currentColor"
        strokeWidth="0.9"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Arrowheads */}
      {[0, 1].map((i) => {
        const ax = i === 0 ? ox1 : ox2;
        const ay = i === 0 ? oy1 : oy2;
        const dir = i === 0 ? 1 : -1;
        const d = horizontal
          ? `M ${ax} ${ay} L ${ax + dir * 5} ${ay - 2.5} L ${ax + dir * 5} ${ay + 2.5} Z`
          : vertical
          ? `M ${ax} ${ay} L ${ax - 2.5} ${ay + dir * 5} L ${ax + 2.5} ${ay + dir * 5} Z`
          : `M ${ax} ${ay} l ${dir * 5} -2.5 l 0 5 Z`;
        return (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          />
        );
      })}
      {/* Label with background chip */}
      <motion.g
        transform={`translate(${mx} ${my}) rotate(${horizontal ? 0 : angle})`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.3 }}
      >
        <rect
          x={-label.length * 2.5 - 4}
          y={-6}
          width={label.length * 5 + 8}
          height={12}
          fill="var(--bg-muted)"
          rx="1"
        />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          letterSpacing="0.08em"
          fill="currentColor"
        >
          {label}
        </text>
      </motion.g>
    </motion.g>
  );
}

/**
 * Annotation badge (e.g., "EN 1090", "SECTION A-A")
 */
function Annotation({
  x,
  y,
  label,
  delay = 0,
  variant = "copper",
}: {
  x: number;
  y: number;
  label: string;
  delay?: number;
  variant?: "copper" | "primary" | "muted";
}) {
  const color =
    variant === "primary"
      ? "var(--color-primary)"
      : variant === "muted"
      ? "var(--text-muted)"
      : "var(--color-copper)";
  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <rect
        x="0"
        y="-9"
        width={label.length * 5.4 + 14}
        height="14"
        fill="var(--bg-surface)"
        stroke={color}
        strokeWidth="0.6"
        rx="1"
      />
      <circle cx="6" cy="-2" r="1.8" fill={color} />
      <text
        x="13"
        y="2"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        letterSpacing="0.14em"
        fill={color}
      >
        {label}
      </text>
    </motion.g>
  );
}

/* ──────────────────────────────────────────────────────────
   Category drawings
   ────────────────────────────────────────────────────────── */

/** Isometric metal truss / charpente */
function StructuresDrawing() {
  // Isometric truss: angled top chord, horizontal bottom chord, vertical + diagonal members
  return (
    <g>
      {/* Support platforms */}
      <g style={{ color: "var(--text-muted)" }}>
        <line
          x1="60"
          y1="270"
          x2="420"
          y2="270"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={60 + i * 20}
            y1="270"
            x2={54 + i * 20}
            y2="278"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.7"
          />
        ))}
      </g>

      {/* Isometric truss frame */}
      <g style={{ color: "var(--text)" }}>
        {/* Back edge */}
        <motion.path
          d="M 90 240 L 390 240 L 390 140 L 240 80 L 90 140 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Front-offset (depth) */}
        <motion.path
          d="M 120 225 L 420 225 L 420 125 L 270 65 L 120 125 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.85"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Depth connectors */}
        {[
          [90, 240, 120, 225],
          [390, 240, 420, 225],
          [390, 140, 420, 125],
          [240, 80, 270, 65],
          [90, 140, 120, 125],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.75"
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
          />
        ))}
      </g>

      {/* Internal web members (diagonals + verticals) */}
      <g style={{ color: "var(--color-copper)" }}>
        {[
          // back face web
          [90, 240, 165, 110],
          [390, 240, 315, 110],
          [165, 110, 165, 240],
          [240, 80, 240, 240],
          [315, 110, 315, 240],
          [165, 110, 240, 240],
          [315, 110, 240, 240],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.95"
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.7 + i * 0.06, duration: 0.5 }}
          />
        ))}
      </g>

      {/* Weld points */}
      {[
        [165, 110],
        [240, 80],
        [315, 110],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.5"
          fill="var(--color-primary)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3 + i * 0.1, type: "spring" }}
        />
      ))}

      {/* Dimensions */}
      <Dim x1={90} y1={240} x2={390} y2={240} label="L=3200 mm" delay={1.4} above={false} offset={22} />
      <Dim x1={90} y1={140} x2={90} y2={240} label="H 1000" delay={1.7} above={true} offset={22} />

      {/* Annotations */}
      <Annotation x={36} y={58} label="S355 J2" delay={2.0} />
      <Annotation x={36} y={86} label="EN 1090" delay={2.1} variant="primary" />
    </g>
  );
}

/** Sliding gate elevation with rail */
function PortailsDrawing() {
  return (
    <g>
      {/* Ground line */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="30" y1="290" x2="450" y2="290" stroke="currentColor" strokeWidth="1.25" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 19}
            y1="290"
            x2={24 + i * 19}
            y2="298"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
        {/* Rail beneath gate */}
        <line
          x1="60"
          y1="278"
          x2="440"
          y2="278"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="3 2"
          opacity="0.5"
        />
      </g>

      {/* Posts */}
      <g style={{ color: "var(--text)" }}>
        <motion.rect
          x="70"
          y="110"
          width="10"
          height="170"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
        <motion.rect
          x="400"
          y="110"
          width="10"
          height="170"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
      </g>

      {/* Gate frame */}
      <g style={{ color: "var(--text)" }}>
        <motion.rect
          x="90"
          y="130"
          width="300"
          height="148"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Top rail */}
        <motion.line
          x1="90"
          y1="150"
          x2="390"
          y2="150"
          stroke="currentColor"
          strokeWidth="1"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        {/* Bottom rail */}
        <motion.line
          x1="90"
          y1="258"
          x2="390"
          y2="258"
          stroke="currentColor"
          strokeWidth="1"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.6, delay: 0.55 }}
        />
      </g>

      {/* Vertical bars */}
      <g style={{ color: "var(--color-copper)" }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.line
            key={i}
            x1={110 + i * 19}
            y1={150}
            x2={110 + i * 19}
            y2={258}
            stroke="currentColor"
            strokeWidth="1.2"
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.7 + i * 0.03, duration: 0.4 }}
          />
        ))}
      </g>

      {/* Direction arrow (slide) */}
      <motion.g
        style={{ color: "var(--color-primary)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <line x1="200" y1="102" x2="290" y2="102" stroke="currentColor" strokeWidth="1.3" />
        <path d="M 290 102 L 284 98 L 284 106 Z" fill="currentColor" />
        <line x1="200" y1="102" x2="206" y2="98" stroke="currentColor" strokeWidth="1.3" />
        <line x1="200" y1="102" x2="206" y2="106" stroke="currentColor" strokeWidth="1.3" />
      </motion.g>

      {/* Wheel detail */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <circle cx="130" cy="278" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="130" cy="278" r="2" fill="currentColor" />
        <circle cx="350" cy="278" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="350" cy="278" r="2" fill="currentColor" />
      </motion.g>

      {/* Dimensions */}
      <Dim x1={90} y1={278} x2={390} y2={278} label="4500 mm" delay={1.4} above={false} offset={16} />
      <Dim x1={70} y1={110} x2={70} y2={280} label="1800" delay={1.7} above={true} offset={18} />

      <Annotation x={36} y={60} label="COULISSANT" delay={1.9} />
      <Annotation x={36} y={88} label="MOTORISE" delay={2.0} variant="primary" />
    </g>
  );
}

/** Sectional industrial door with tracks */
function IndustriellesDrawing() {
  return (
    <g>
      {/* Ground */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="40" y1="290" x2="440" y2="290" stroke="currentColor" strokeWidth="1.3" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={40 + i * 20}
            y1="290"
            x2={34 + i * 20}
            y2="298"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Outer frame / jambs */}
      <g style={{ color: "var(--text)" }}>
        <motion.path
          d="M 100 290 L 100 90 L 380 90 L 380 290"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1.1, delay: 0.1 }}
        />
        {/* Header beam */}
        <motion.rect
          x="90"
          y="78"
          width="300"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </g>

      {/* Sectional panels */}
      <g style={{ color: "var(--color-copper)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.g
            key={i}
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
          >
            <rect
              x="110"
              y={100 + i * 30}
              width="260"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            {/* Ribs */}
            <line
              x1="110"
              y1={108 + i * 30}
              x2="370"
              y2={108 + i * 30}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.7"
            />
            <line
              x1="110"
              y1={120 + i * 30}
              x2="370"
              y2={120 + i * 30}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.7"
            />
          </motion.g>
        ))}
        {/* Viewing window (top panel) */}
        <motion.rect
          x="180"
          y="108"
          width="40"
          height="14"
          fill="var(--bg-surface)"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        />
        <motion.rect
          x="260"
          y="108"
          width="40"
          height="14"
          fill="var(--bg-surface)"
          stroke="currentColor"
          strokeWidth="0.8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        />
      </g>

      {/* Tracks */}
      <g style={{ color: "var(--text-secondary)" }}>
        <motion.path
          d="M 100 90 C 100 60 100 50 130 50 L 430 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="3 3"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
        <motion.path
          d="M 380 90 C 380 60 380 50 410 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="3 3"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ delay: 1.3, duration: 0.6 }}
        />
      </g>

      {/* Motor */}
      <motion.g
        style={{ color: "var(--color-primary)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <rect x="410" y="40" width="22" height="16" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1" />
        <circle cx="421" cy="48" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="421" cy="48" r="1" fill="currentColor" />
      </motion.g>

      {/* Dimensions */}
      <Dim x1={100} y1={290} x2={380} y2={290} label="3500 mm" delay={1.5} above={false} offset={14} />
      <Dim x1={100} y1={90} x2={100} y2={290} label="4000" delay={1.8} above={true} offset={16} />

      <Annotation x={36} y={60} label="SECTIONAL" delay={1.9} />
      <Annotation x={36} y={88} label="INDUSTRIAL" delay={2.0} variant="primary" />
    </g>
  );
}

/** Glass facade / curtain wall grid */
function MenuiserieDrawing() {
  const cols = 5;
  const rows = 3;
  const startX = 70;
  const startY = 70;
  const cellW = 68;
  const cellH = 66;

  return (
    <g>
      {/* Outer facade frame */}
      <g style={{ color: "var(--text)" }}>
        <motion.rect
          x={startX}
          y={startY}
          width={cols * cellW}
          height={rows * cellH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1.1, delay: 0.1 }}
        />
      </g>

      {/* Vertical mullions */}
      <g style={{ color: "var(--text-secondary)" }}>
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <motion.line
            key={`v${i}`}
            x1={startX + (i + 1) * cellW}
            y1={startY}
            x2={startX + (i + 1) * cellW}
            y2={startY + rows * cellH}
            stroke="currentColor"
            strokeWidth="1.3"
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
          />
        ))}
        {/* Horizontal transoms */}
        {Array.from({ length: rows - 1 }).map((_, i) => (
          <motion.line
            key={`h${i}`}
            x1={startX}
            y1={startY + (i + 1) * cellH}
            x2={startX + cols * cellW}
            y2={startY + (i + 1) * cellH}
            stroke="currentColor"
            strokeWidth="1.3"
            initial={ANIM.initial}
            animate={ANIM.animate}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
          />
        ))}
      </g>

      {/* Glass shimmer (diagonal reflections in each pane) */}
      <g style={{ color: "var(--color-copper)" }} opacity="0.45">
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <motion.line
              key={`g-${r}-${c}`}
              x1={startX + c * cellW + 10}
              y1={startY + r * cellH + 8}
              x2={startX + c * cellW + 26}
              y2={startY + r * cellH + 30}
              stroke="currentColor"
              strokeWidth="0.6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.0 + (r * cols + c) * 0.03 }}
            />
          ))
        )}
      </g>

      {/* Highlighted operable pane */}
      <motion.g
        style={{ color: "var(--color-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <rect
          x={startX + 2 * cellW + 4}
          y={startY + cellH + 4}
          width={cellW - 8}
          height={cellH - 8}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        {/* Hinge indicator */}
        <path
          d={`M ${startX + 2 * cellW + 4} ${startY + cellH + cellH / 2} L ${startX + 3 * cellW - 4} ${startY + cellH + 4}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </motion.g>

      {/* Ground line */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="40" y1="285" x2="440" y2="285" stroke="currentColor" strokeWidth="1" />
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={40 + i * 20}
            y1="285"
            x2={34 + i * 20}
            y2="293"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Dimensions */}
      <Dim x1={startX} y1={startY + rows * cellH + 8} x2={startX + cols * cellW} y2={startY + rows * cellH + 8} label="L=3400" delay={1.5} above={false} offset={14} />
      <Dim x1={startX - 8} y1={startY} x2={startX - 8} y2={startY + rows * cellH} label="2200" delay={1.7} above={true} offset={14} />

      <Annotation x={36} y={40} label="VEC ALU" delay={1.9} />
      <Annotation x={36} y={58} label="RPT 62mm" delay={2.0} variant="primary" />
    </g>
  );
}

/** Fire door with EI rating */
function CoupeFeuDrawing() {
  return (
    <g>
      {/* Ground */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="30" y1="290" x2="450" y2="290" stroke="currentColor" strokeWidth="1.2" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 19}
            y1="290"
            x2={24 + i * 19}
            y2="298"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Wall */}
      <g style={{ color: "var(--text-muted)" }}>
        <rect x="30" y="60" width="420" height="230" fill="var(--bg-muted)" opacity="0.6" />
        <pattern id="wall-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="12" x2="12" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
        </pattern>
        <rect x="30" y="60" width="420" height="230" fill="url(#wall-hatch)" />
      </g>

      {/* Door frame */}
      <g style={{ color: "var(--text)" }}>
        <motion.rect
          x="160"
          y="80"
          width="160"
          height="210"
          fill="var(--bg-surface)"
          stroke="currentColor"
          strokeWidth="1.6"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1.1, delay: 0.1 }}
        />
      </g>

      {/* Door leaf */}
      <g style={{ color: "var(--text)" }}>
        <motion.rect
          x="170"
          y="90"
          width="140"
          height="200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Inner panel */}
        <motion.rect
          x="185"
          y="105"
          width="110"
          height="170"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.6"
          initial={ANIM.initial}
          animate={ANIM.animate}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </g>

      {/* Handle */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
      >
        <rect x="282" y="192" width="10" height="4" fill="currentColor" />
        <circle cx="286" cy="194" r="2.2" fill="currentColor" />
      </motion.g>

      {/* EI Shield - the centerpiece */}
      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Shield outline */}
        <path
          d="M 240 120 L 265 130 L 265 165 C 265 180 252 192 240 196 C 228 192 215 180 215 165 L 215 130 Z"
          fill="var(--bg-surface)"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
        {/* Flame icon */}
        <path
          d="M 240 140 C 236 148 232 150 232 158 C 232 165 236 169 240 169 C 244 169 248 165 248 158 C 248 150 244 148 240 140 Z"
          fill="var(--color-primary)"
          opacity="0.9"
        />
        <text
          x="240"
          y="188"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fontWeight="700"
          letterSpacing="0.12em"
          fill="var(--color-primary)"
        >
          EI 60
        </text>
      </motion.g>

      {/* Certification plate */}
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <rect
          x="196"
          y="240"
          width="88"
          height="22"
          fill="var(--bg-surface)"
          stroke="var(--color-copper)"
          strokeWidth="0.6"
          rx="1"
        />
        <text
          x="240"
          y="252"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          letterSpacing="0.15em"
          fill="var(--color-copper)"
        >
          EN 1634-1
        </text>
        <text
          x="240"
          y="260"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="6"
          letterSpacing="0.1em"
          fill="var(--text-muted)"
        >
          PV-LAB
        </text>
      </motion.g>

      {/* Dimensions */}
      <Dim x1={160} y1={80} x2={160} y2={290} label="2100" delay={1.6} above={true} offset={16} />
      <Dim x1={160} y1={300} x2={320} y2={300} label="1600 mm" delay={1.8} above={false} offset={10} />

      <Annotation x={36} y={60} label="RESISTANT FEU" delay={2.0} variant="primary" />
    </g>
  );
}

/** Motor + control panel schematic */
function AutomatismesDrawing() {
  return (
    <g>
      {/* Schematic background rails */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="40" y1="180" x2="440" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
      </g>

      {/* Motor block (left) */}
      <motion.g
        style={{ color: "var(--text)" }}
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <rect x="60" y="130" width="110" height="100" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1.4" />
        {/* Motor body */}
        <rect x="70" y="150" width="70" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Shaft */}
        <rect x="140" y="172" width="22" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Fan grill */}
        <g style={{ color: "var(--color-copper)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={78}
              y1={158 + i * 9}
              x2={132}
              y2={158 + i * 9}
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.8"
            />
          ))}
        </g>
        <text
          x="115"
          y="145"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          letterSpacing="0.1em"
          fill="var(--text-muted)"
        >
          M1 - 24V DC
        </text>
      </motion.g>

      {/* Connection line between motor and control */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <path
          d="M 170 180 L 210 180 L 210 140 L 270 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M 170 200 L 220 200 L 220 220 L 270 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        {/* Connection dots */}
        <circle cx="170" cy="180" r="2" fill="currentColor" />
        <circle cx="170" cy="200" r="2" fill="currentColor" />
        <circle cx="270" cy="140" r="2" fill="currentColor" />
        <circle cx="270" cy="220" r="2" fill="currentColor" />
      </motion.g>

      {/* Control box (right) */}
      <motion.g
        style={{ color: "var(--text)" }}
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <rect x="270" y="100" width="140" height="160" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1.5" />
        {/* Display */}
        <rect x="285" y="120" width="110" height="30" fill="var(--bg-muted)" stroke="currentColor" strokeWidth="0.8" />
        <text
          x="340"
          y="140"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.12em"
          fill="var(--color-primary)"
        >
          READY
        </text>

        {/* Status LEDs */}
        <g>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={295 + i * 14}
              cy={170}
              r="4"
              fill={i === 0 ? "var(--color-primary)" : i === 1 ? "var(--color-copper)" : "var(--text-muted)"}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: 1.2 + i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* Buttons */}
        <g style={{ color: "var(--text-secondary)" }}>
          <rect x="285" y="190" width="32" height="18" fill="none" stroke="currentColor" strokeWidth="0.8" rx="2" />
          <rect x="325" y="190" width="32" height="18" fill="none" stroke="currentColor" strokeWidth="0.8" rx="2" />
          <rect x="365" y="190" width="32" height="18" fill="none" stroke="currentColor" strokeWidth="0.8" rx="2" />
          <text x="301" y="201" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fill="currentColor">A</text>
          <text x="341" y="201" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fill="currentColor">B</text>
          <text x="381" y="201" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fill="currentColor">C</text>
        </g>

        {/* Key switch */}
        <g style={{ color: "var(--color-copper)" }}>
          <circle cx="340" cy="230" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="340" y1="226" x2="340" y2="234" stroke="currentColor" strokeWidth="1.2" />
          <line x1="340" y1="234" x2="336" y2="232" stroke="currentColor" strokeWidth="1.2" />
        </g>
      </motion.g>

      {/* Signal waves */}
      <motion.g
        style={{ color: "var(--color-primary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.path
          d="M 430 130 Q 445 118 430 106"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 430 140 Q 455 120 430 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </motion.g>

      {/* Annotations */}
      <Annotation x={36} y={60} label="24V DC" delay={1.6} />
      <Annotation x={36} y={88} label="IP54 / CE" delay={1.8} variant="primary" />
      <Annotation x={280} y={290} label="EN 13849-1" delay={2.0} variant="muted" />
    </g>
  );
}

/** Wrench + gear maintenance */
const BIG_GEAR_PATH = gearPath(240, 180, 80, 64, 14);
const SMALL_GEAR_PATH = gearPath(350, 100, 34, 26, 10);

function MaintenanceDrawing() {
  return (
    <g>
      {/* Large central gear */}
      <motion.g
        style={{ color: "var(--text)" }}
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={{ duration: 1.2, delay: 0.1 }}
      >
        <motion.g
          style={{ transformOrigin: "240px 180px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* Gear teeth - rendered as path */}
          <path
            d={BIG_GEAR_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Inner ring */}
          <circle
            cx="240"
            cy="180"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            opacity="0.7"
          />
          {/* Center */}
          <circle cx="240" cy="180" r="14" fill="var(--bg-muted)" stroke="currentColor" strokeWidth="1" />
          <circle cx="240" cy="180" r="5" fill="currentColor" />
          {/* Spokes */}
          {[0, 60, 120].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = 240 + Math.cos(rad) * 44;
            const y2 = 180 + Math.sin(rad) * 44;
            const x1 = 240 + Math.cos(rad) * 14;
            const y1 = 180 + Math.sin(rad) * 14;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.8"
              />
            );
          })}
        </motion.g>
      </motion.g>

      {/* Small gear (top right) */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={ANIM.initial}
        animate={ANIM.animate}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <motion.g
          style={{ transformOrigin: "350px 100px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <path
            d={SMALL_GEAR_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="350" cy="100" r="16" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="350" cy="100" r="5" fill="currentColor" />
        </motion.g>
      </motion.g>

      {/* Wrench (angled, crossing lower-left to upper-right) */}
      <motion.g
        style={{ color: "var(--color-primary)", transformOrigin: "240px 280px" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <g transform="translate(240 280) rotate(-30)">
          {/* Handle */}
          <rect x="-70" y="-6" width="140" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" rx="2" />
          {/* Jaw left */}
          <path
            d="M -70 -6 L -86 -14 L -94 -8 L -94 8 L -86 14 L -70 6 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="-84" y="-4" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Jaw right */}
          <path
            d="M 70 -6 L 86 -14 L 94 -8 L 94 8 L 86 14 L 70 6 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="76" y="-4" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Shine */}
          <line x1="-60" y1="-2" x2="60" y2="-2" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </g>
      </motion.g>

      {/* Maintenance checkmarks */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {[
          { x: 90, y: 80, label: "CTRL" },
          { x: 90, y: 120, label: "MAJ" },
          { x: 90, y: 160, label: "PREV" },
        ].map((item, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + i * 0.15 }}
          >
            <rect x={item.x} y={item.y - 8} width="50" height="16" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="0.6" rx="1" />
            <path
              d={`M ${item.x + 6} ${item.y} l 3 3 l 6 -6`}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={item.x + 20}
              y={item.y + 3}
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              letterSpacing="0.1em"
              fill="currentColor"
            >
              {item.label}
            </text>
          </motion.g>
        ))}
      </motion.g>

      {/* Annotations */}
      <Annotation x={36} y={280} label="PLAN MAINT." delay={1.8} />
      <Annotation x={36} y={308} label="24h/7j" delay={2.0} variant="primary" />
    </g>
  );
}

/**
 * Construct a gear-like path with a given number of teeth.
 */
function gearPath(cx: number, cy: number, outerR: number, innerR: number, teeth: number) {
  const parts: string[] = [];
  const step = (Math.PI * 2) / (teeth * 2);
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

/* ──────────────────────────────────────────────────────────
   Root
   ────────────────────────────────────────────────────────── */

const labelMap: Record<string, string> = {
  structures: "Charpente métallique",
  portails: "Portail coulissant",
  industrielles: "Porte sectionnelle",
  menuiserie: "Mur rideau VEC",
  "coupe-feu": "Porte coupe-feu EI",
  automatismes: "Automatisme industriel",
  maintenance: "Plan de maintenance",
};

const drawingMap: Record<string, React.FC> = {
  structures: StructuresDrawing,
  portails: PortailsDrawing,
  industrielles: IndustriellesDrawing,
  menuiserie: MenuiserieDrawing,
  "coupe-feu": CoupeFeuDrawing,
  automatismes: AutomatismesDrawing,
  maintenance: MaintenanceDrawing,
};

// Some callers pass the full service slug (e.g. "fermetures-industrielles"),
// others pass the short category key (e.g. "industrielles"). This map bridges
// both so the drawings pick up correctly in either case.
const slugAliases: Record<string, string> = {
  "fermetures-industrielles": "industrielles",
  "portails-clotures": "portails",
  "structures-metalliques": "structures",
  "menuiserie-vitrerie": "menuiserie",
  "portes-coupe-feu": "coupe-feu",
};

export function resolveIllustrationKey(category: string): string {
  const lc = category.toLowerCase();
  return slugAliases[lc] ?? lc;
}

export const PROJECT_ILLUSTRATION_KEYS = [
  "industrielles",
  "portails",
  "structures",
  "menuiserie",
  "coupe-feu",
  "automatismes",
  "maintenance",
] as const;

export function ProjectIllustration({
  category,
  className,
  title,
  accentColor,
  hideTitle = false,
  animKey,
}: ProjectIllustrationProps) {
  const key = resolveIllustrationKey(category);
  const Drawing = drawingMap[key] ?? StructuresDrawing;
  const defaultTitle = labelMap[key] ?? "Projet métallique";
  const resolvedTitle = title ?? defaultTitle;
  const patternId = `proj-${key}`;

  // Override the copper var locally so every `var(--color-copper)` inside
  // the drawing picks up the per-instance accent. If accentColor is absent,
  // the drawing keeps the global copper.
  const styleOverride: React.CSSProperties = accentColor
    ? ({ "--color-copper": `rgb(${accentColor})` } as React.CSSProperties)
    : {};

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        className
      )}
      style={{
        background: "var(--bg-muted)",
        border: "1px solid var(--border)",
        ...styleOverride,
      }}
      role="img"
      aria-label={`Illustration technique — ${resolvedTitle}`}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <BlueprintGrid id={patternId} />
        <Frame>
          {/* Keyed so that cycling scenes triggers a fresh entry animation */}
          <g key={animKey ?? key}>
            <Drawing />
          </g>
        </Frame>
      </svg>
      {/* Small title label overlay */}
      {!hideTitle && (
        <div
          className="pointer-events-none absolute left-4 top-4 flex items-center gap-2"
          aria-hidden
        >
          <span
            className="h-px w-6"
            style={{ background: "var(--color-copper)" }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "var(--text-secondary)" }}
          >
            {resolvedTitle}
          </span>
        </div>
      )}
    </div>
  );
}

export default ProjectIllustration;
