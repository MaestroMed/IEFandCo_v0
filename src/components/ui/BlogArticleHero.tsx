"use client";

import { motion } from "motion/react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/**
 * BlogArticleHero
 *
 * Stylised SVG illustration for blog post cards. Each known category gets a
 * distinct, hand-composed scene; unknown categories fall back to "Guide".
 *
 * Categories:
 *  - "Guide"      → layered document with annotations
 *  - "Normes"     → certification stamp + checkmark
 *  - "Technique"  → caliper / precision tool with measurement lines
 *  - "Case Study" → architectural elevation with a highlighted element
 *
 * Honors prefers-reduced-motion via static initial-state rendering.
 */

interface BlogArticleHeroProps {
  category: string;
  className?: string;
  /** Override the displayed label (defaults to the category). */
  label?: string;
  /** Compact card variant (used in lists). */
  compact?: boolean;
}

const VB_W = 480;
const VB_H = 320;

/* ───────────────── Shared bits ───────────────── */

function BlueprintBg({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern
          id={`blog-grid-${id}`}
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
        <linearGradient id={`blog-fade-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-copper)" stopOpacity="0.08" />
          <stop offset="60%" stopColor="var(--color-copper)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={VB_W} height={VB_H} fill="var(--bg-muted)" />
      <g style={{ color: "var(--text-muted)" }}>
        <rect width={VB_W} height={VB_H} fill={`url(#blog-grid-${id})`} />
      </g>
      <rect width={VB_W} height={VB_H} fill={`url(#blog-fade-${id})`} />
    </>
  );
}

function CornerBrackets() {
  return (
    <g style={{ color: "var(--color-copper)" }}>
      {[
        { x: 16, y: 16, d: "M 0 8 L 0 0 L 8 0" },
        { x: VB_W - 16, y: 16, d: "M -8 0 L 0 0 L 0 8" },
        { x: 16, y: VB_H - 16, d: "M 0 -8 L 0 0 L 8 0" },
        { x: VB_W - 16, y: VB_H - 16, d: "M 0 -8 L 0 0 L -8 0" },
      ].map((c, i) => (
        <path
          key={i}
          d={c.d}
          transform={`translate(${c.x} ${c.y})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </g>
  );
}

function CategoryStamp({
  label,
  delay = 0,
  inView,
}: {
  label: string;
  delay?: number;
  inView: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, x: -6 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
      transition={{ delay, duration: 0.5 }}
    >
      <rect
        x="28"
        y="28"
        width={label.length * 6.6 + 26}
        height="20"
        fill="var(--bg-surface)"
        stroke="var(--color-copper)"
        strokeWidth="0.8"
        rx="2"
      />
      <circle cx="38" cy="38" r="2.4" fill="var(--color-copper)" />
      <text
        x="46"
        y="42"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.18em"
        fill="var(--color-copper)"
      >
        {label.toUpperCase()}
      </text>
    </motion.g>
  );
}

/* ───────────────── Scenes ───────────────── */

/** Layered book/document with annotations */
function GuideScene({ inView }: { inView: boolean }) {
  return (
    <g>
      {/* Stack of pages (back to front) */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <rect
          x="180"
          y="105"
          width="180"
          height="160"
          rx="4"
          fill="var(--bg-surface)"
          stroke="var(--text-muted)"
          strokeWidth="0.8"
        />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect
          x="170"
          y="95"
          width="180"
          height="160"
          rx="4"
          fill="var(--bg-surface)"
          stroke="var(--text-muted)"
          strokeWidth="0.8"
        />
      </motion.g>
      {/* Top page */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <rect
          x="160"
          y="85"
          width="180"
          height="160"
          rx="4"
          fill="var(--bg-surface)"
          stroke="var(--text)"
          strokeWidth="1.2"
        />
        {/* Page header band */}
        <rect
          x="160"
          y="85"
          width="180"
          height="22"
          fill="var(--color-copper)"
          opacity="0.12"
        />
        <line
          x1="160"
          y1="107"
          x2="340"
          y2="107"
          stroke="var(--color-copper)"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <text
          x="170"
          y="100"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.16em"
          fill="var(--color-copper)"
        >
          GUIDE
        </text>
        <text
          x="332"
          y="100"
          textAnchor="end"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.1em"
          fill="var(--text-muted)"
        >
          PG. 01
        </text>

        {/* Content lines */}
        {[120, 134, 148, 168, 182, 196, 216, 230].map((y, i) => (
          <motion.line
            key={i}
            x1="172"
            y1={y}
            x2={i % 3 === 2 ? 280 : 328}
            y2={y}
            stroke="var(--text-muted)"
            strokeWidth="1.2"
            opacity="0.55"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
          />
        ))}
      </motion.g>

      {/* Floating annotation arrow + label */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <line
          x1="368"
          y1="130"
          x2="350"
          y2="130"
          stroke="var(--color-primary)"
          strokeWidth="1.2"
        />
        <path
          d="M 350 130 l 5 -3 l 0 6 Z"
          fill="var(--color-primary)"
        />
        <rect
          x="368"
          y="120"
          width="76"
          height="20"
          fill="var(--bg-surface)"
          stroke="var(--color-primary)"
          strokeWidth="0.7"
          rx="2"
        />
        <text
          x="406"
          y="134"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.14em"
          fill="var(--color-primary)"
        >
          POINT CLE
        </text>
      </motion.g>

      {/* Bookmark tab */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <path
          d="M 290 85 L 290 130 L 300 122 L 310 130 L 310 85 Z"
          fill="var(--color-primary)"
          opacity="0.85"
        />
      </motion.g>
    </g>
  );
}

/** Certification stamp + checkmark */
function NormesScene({ inView }: { inView: boolean }) {
  return (
    <g>
      {/* Certificate ribbon background */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <rect
          x="120"
          y="80"
          width="200"
          height="170"
          fill="var(--bg-surface)"
          stroke="var(--text)"
          strokeWidth="1.4"
          rx="2"
        />
        {/* Decorative scallop top */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={130 + i * 20}
            y1={92}
            x2={140 + i * 20}
            y2={92}
            stroke="var(--color-copper)"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        <line x1="130" y1="100" x2="310" y2="100" stroke="var(--color-copper)" strokeWidth="0.6" opacity="0.6" />
      </motion.g>

      {/* Title */}
      <motion.text
        x="220"
        y="124"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.22em"
        fill="var(--color-copper)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7 }}
      >
        CERTIFICAT
      </motion.text>

      {/* Norm reference */}
      <motion.text
        x="220"
        y="148"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.08em"
        fill="var(--text)"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        EN 1090
      </motion.text>

      <motion.text
        x="220"
        y="170"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.18em"
        fill="var(--text-secondary)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1 }}
      >
        EXECUTION CLASS EXC2
      </motion.text>

      {/* Round seal with checkmark (bottom-right) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: -12 } : { opacity: 0, scale: 0.6, rotate: -12 }}
        transition={{ delay: 1.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "300px 215px" }}
      >
        <circle
          cx="300"
          cy="215"
          r="38"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
        <circle
          cx="300"
          cy="215"
          r="32"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* Decorative arc text indicator */}
        <path
          d="M 270 215 A 30 30 0 0 1 330 215"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.7"
        />
        {/* Checkmark */}
        <motion.path
          d="M 286 215 L 295 226 L 316 204"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 1.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.g>

      {/* Signature line */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.3 }}
      >
        <line
          x1="135"
          y1="220"
          x2="240"
          y2="220"
          stroke="var(--text-muted)"
          strokeWidth="0.6"
        />
        <text
          x="135"
          y="232"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          letterSpacing="0.15em"
          fill="var(--text-muted)"
        >
          IEF & CO — 2026
        </text>
        {/* Squiggle as faux signature */}
        <path
          d="M 145 215 c 4 -8 12 -2 16 -8 c 4 -6 10 0 14 -6 c 4 -4 8 6 12 0"
          fill="none"
          stroke="var(--color-copper)"
          strokeWidth="0.9"
          opacity="0.7"
        />
      </motion.g>
    </g>
  );
}

/** Caliper / precision measurement */
function TechniqueScene({ inView }: { inView: boolean }) {
  // Measured part: a small flange / rectangle
  const partX = 200;
  const partY = 150;
  const partW = 90;
  const partH = 50;

  return (
    <g>
      {/* The measured object */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <rect
          x={partX}
          y={partY}
          width={partW}
          height={partH}
          fill="var(--text)"
          opacity="0.08"
          stroke="var(--text)"
          strokeWidth="1.5"
        />
        {/* Bolt holes */}
        <circle cx={partX + 14} cy={partY + 14} r="3.5" fill="none" stroke="var(--text)" strokeWidth="1" />
        <circle cx={partX + partW - 14} cy={partY + 14} r="3.5" fill="none" stroke="var(--text)" strokeWidth="1" />
        <circle cx={partX + 14} cy={partY + partH - 14} r="3.5" fill="none" stroke="var(--text)" strokeWidth="1" />
        <circle cx={partX + partW - 14} cy={partY + partH - 14} r="3.5" fill="none" stroke="var(--text)" strokeWidth="1" />
        {/* Hatching inside */}
        <pattern id="part-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="6" y2="0" stroke="var(--text)" strokeWidth="0.3" opacity="0.4" />
        </pattern>
        <rect x={partX} y={partY} width={partW} height={partH} fill="url(#part-hatch)" />
      </motion.g>

      {/* Caliper jaws (above the part) */}
      <motion.g
        initial={{ opacity: 0, y: -8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Beam */}
        <rect
          x={partX - 10}
          y={partY - 38}
          width={partW + 20}
          height="14"
          fill="var(--bg-surface)"
          stroke="var(--text)"
          strokeWidth="1.2"
          rx="1"
        />
        {/* Scale ticks on beam */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={i}
            x1={partX - 5 + i * (partW + 10) / 10}
            y1={partY - 32}
            x2={partX - 5 + i * (partW + 10) / 10}
            y2={partY - 28}
            stroke="var(--text-muted)"
            strokeWidth="0.5"
          />
        ))}
        {/* Fixed jaw (left, descends to measure) */}
        <path
          d={`M ${partX - 10} ${partY - 24} L ${partX - 10} ${partY + 4} L ${partX - 4} ${partY + 4} L ${partX - 4} ${partY - 18} Z`}
          fill="var(--text)"
          opacity="0.85"
        />
        {/* Movable jaw (right) */}
        <path
          d={`M ${partX + partW + 10} ${partY - 24} L ${partX + partW + 10} ${partY + 4} L ${partX + partW + 4} ${partY + 4} L ${partX + partW + 4} ${partY - 18} Z`}
          fill="var(--text)"
          opacity="0.85"
        />
        {/* Slider above */}
        <rect
          x={partX + partW - 6}
          y={partY - 44}
          width="20"
          height="10"
          fill="var(--color-copper)"
          opacity="0.85"
          stroke="var(--text)"
          strokeWidth="0.8"
        />
      </motion.g>

      {/* Digital readout */}
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ delay: 0.95, duration: 0.4 }}
      >
        <rect
          x={partX + 10}
          y={partY - 78}
          width="76"
          height="22"
          fill="var(--bg-surface)"
          stroke="var(--color-primary)"
          strokeWidth="1"
          rx="2"
        />
        <text
          x={partX + 48}
          y={partY - 63}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="13"
          fontWeight="700"
          letterSpacing="0.1em"
          fill="var(--color-primary)"
        >
          90.05 mm
        </text>
      </motion.g>

      {/* Measurement extension lines + dimension below the part */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.15, duration: 0.5 }}
      >
        <line
          x1={partX}
          y1={partY + partH}
          x2={partX}
          y2={partY + partH + 28}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1={partX + partW}
          y1={partY + partH}
          x2={partX + partW}
          y2={partY + partH + 28}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <motion.line
          x1={partX}
          y1={partY + partH + 22}
          x2={partX + partW}
          y2={partY + partH + 22}
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />
        <path
          d={`M ${partX} ${partY + partH + 22} l 5 -3 l 0 6 Z`}
          fill="currentColor"
        />
        <path
          d={`M ${partX + partW} ${partY + partH + 22} l -5 -3 l 0 6 Z`}
          fill="currentColor"
        />
        <rect
          x={partX + partW / 2 - 26}
          y={partY + partH + 12}
          width="52"
          height="20"
          fill="var(--bg-muted)"
          rx="1"
        />
        <text
          x={partX + partW / 2}
          y={partY + partH + 26}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.1em"
          fill="currentColor"
        >
          ±0.02
        </text>
      </motion.g>

      {/* Tolerance callout */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <line x1="370" y1="170" x2="345" y2="180" stroke="var(--color-primary)" strokeWidth="0.8" />
        <circle cx="345" cy="180" r="2.4" fill="var(--color-primary)" />
        <rect x="370" y="158" width="86" height="22" fill="var(--bg-surface)" stroke="var(--color-primary)" strokeWidth="0.8" rx="2" />
        <text x="380" y="173" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" letterSpacing="0.14em" fill="var(--color-primary)">
          ISO 2768-m
        </text>
      </motion.g>
    </g>
  );
}

/** Architectural elevation with one highlighted element */
function CaseStudyScene({ inView }: { inView: boolean }) {
  return (
    <g>
      {/* Ground line */}
      <g style={{ color: "var(--text-muted)" }}>
        <line x1="40" y1="260" x2="440" y2="260" stroke="currentColor" strokeWidth="1.2" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={40 + i * 18}
            y1="260"
            x2={34 + i * 18}
            y2="268"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Building elevation — three storeys */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Outer envelope */}
        <rect x="100" y="100" width="280" height="160" fill="var(--bg-surface)" stroke="var(--text)" strokeWidth="1.5" />
        {/* Floor lines */}
        <line x1="100" y1="153" x2="380" y2="153" stroke="var(--text-secondary)" strokeWidth="0.8" />
        <line x1="100" y1="206" x2="380" y2="206" stroke="var(--text-secondary)" strokeWidth="0.8" />
      </motion.g>

      {/* Window grid */}
      <g style={{ color: "var(--text-secondary)" }}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <motion.rect
              key={`${row}-${col}`}
              x={114 + col * 52}
              y={108 + row * 53}
              width="42"
              height="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.85 } : { opacity: 0 }}
              transition={{ delay: 0.5 + (row * 5 + col) * 0.04, duration: 0.3 }}
            />
          ))
        )}
        {/* Mullion details */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <line
              key={`m-${row}-${col}`}
              x1={114 + col * 52 + 21}
              y1={108 + row * 53}
              x2={114 + col * 52 + 21}
              y2={108 + row * 53 + 36}
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.4"
            />
          ))
        )}
      </g>

      {/* Roof cornice / parapet */}
      <motion.g
        initial={{ opacity: 0, y: -4 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <line x1="92" y1="100" x2="388" y2="100" stroke="var(--text)" strokeWidth="2" />
        <line x1="100" y1="92" x2="380" y2="92" stroke="var(--text-secondary)" strokeWidth="0.8" />
      </motion.g>

      {/* HIGHLIGHTED element — central window with copper accent */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "240px 178px" }}
      >
        {/* Highlight glow */}
        <rect
          x="218"
          y="161"
          width="42"
          height="36"
          fill="var(--color-copper)"
          opacity="0.18"
        />
        {/* Pulsing border */}
        <motion.rect
          x="216"
          y="159"
          width="46"
          height="40"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.6"
          animate={inView ? { opacity: [1, 0.4, 1] } : { opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        />
        {/* Callout line */}
        <line x1="262" y1="178" x2="320" y2="115" stroke="var(--color-primary)" strokeWidth="0.9" />
        <circle cx="262" cy="178" r="2.4" fill="var(--color-primary)" />
        {/* Callout label */}
        <rect
          x="320"
          y="98"
          width="106"
          height="36"
          fill="var(--bg-surface)"
          stroke="var(--color-primary)"
          strokeWidth="0.9"
          rx="2"
        />
        <text
          x="328"
          y="114"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="0.16em"
          fill="var(--color-primary)"
        >
          MUR RIDEAU
        </text>
        <text
          x="328"
          y="128"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.12em"
          fill="var(--text-secondary)"
        >
          REF. CR-208
        </text>
      </motion.g>

      {/* Door at base */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.85 }}
      >
        <rect x="226" y="220" width="28" height="40" fill="var(--bg-muted)" stroke="var(--text)" strokeWidth="1" />
        <line x1="240" y1="220" x2="240" y2="260" stroke="var(--text-secondary)" strokeWidth="0.4" />
      </motion.g>

      {/* Span dimension at the bottom */}
      <motion.g
        style={{ color: "var(--color-copper)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <line x1="100" y1="282" x2="380" y2="282" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 100 282 l 5 -3 l 0 6 Z" fill="currentColor" />
        <path d="M 380 282 l -5 -3 l 0 6 Z" fill="currentColor" />
        <line x1="100" y1="265" x2="100" y2="285" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.7" />
        <line x1="380" y1="265" x2="380" y2="285" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.7" />
        <rect x="214" y="276" width="52" height="14" fill="var(--bg-muted)" rx="1" />
        <text
          x="240"
          y="286"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.1em"
          fill="currentColor"
        >
          14.000 m
        </text>
      </motion.g>
    </g>
  );
}

/* ───────────────── Root ───────────────── */

const sceneMap: Record<string, React.FC<{ inView: boolean }>> = {
  guide: GuideScene,
  guides: GuideScene,
  normes: NormesScene,
  norme: NormesScene,
  technique: TechniqueScene,
  techniques: TechniqueScene,
  "case study": CaseStudyScene,
  "case-study": CaseStudyScene,
  "etude de cas": CaseStudyScene,
  case: CaseStudyScene,
};

const labelMap: Record<string, string> = {
  guide: "Guide",
  guides: "Guide",
  normes: "Normes",
  norme: "Normes",
  technique: "Technique",
  techniques: "Technique",
  "case study": "Case Study",
  "case-study": "Case Study",
  "etude de cas": "Etude de cas",
  case: "Case Study",
};

export function BlogArticleHero({
  category,
  className,
  label,
  compact = false,
}: BlogArticleHeroProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "-30px",
  });
  const key = category.trim().toLowerCase();
  const Scene = sceneMap[key] ?? GuideScene;
  const resolvedLabel = label ?? labelMap[key] ?? category;
  const patternId = `blog-${key.replace(/\s+/g, "-") || "default"}`;

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        compact ? "aspect-[16/10]" : "aspect-[3/2]",
        className
      )}
      style={{
        background: "var(--bg-muted)",
        border: "1px solid var(--border)",
      }}
      role="img"
      aria-label={`Illustration de la categorie ${resolvedLabel}`}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <BlueprintBg id={patternId} />
        <CornerBrackets />
        <CategoryStamp label={resolvedLabel} delay={0.2} inView={inView} />
        <Scene inView={inView} />

        {/* Bottom-right meta */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          <text
            x={VB_W - 24}
            y={VB_H - 22}
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            letterSpacing="0.18em"
            fill="var(--text-muted)"
          >
            IEF & CO — JOURNAL
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

export default BlogArticleHero;
