"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ClientLogoBadge
 *
 * A designed wordmark/badge used in place of real client logos.
 * Renders the company name in a uppercase, monospaced+letter-spaced treatment
 * with a small geometric mark on the left and a subtle bordered chip — the
 * sort of treatment you'd see in a "Trusted by" row on Linear, Stripe, etc.
 *
 * Variants:
 *  - "default" : full chip with border + bullet mark
 *  - "minimal" : just the bullet + name (for marquees / dense rows)
 *  - "stamped" : larger outlined plate, suitable for hero strips
 *
 * Bullet shapes are deterministically picked from the name so each company
 * gets a stable but visually distinct mark.
 */

type Variant = "default" | "minimal" | "stamped";

interface ClientLogoBadgeProps {
  name: string;
  className?: string;
  variant?: Variant;
  /** Override the auto-picked geometric mark. */
  mark?: "square" | "circle" | "diamond" | "bar" | "ring" | "triangle" | "cross";
  /** Index used for staggered marquee animations (optional). */
  index?: number;
}

const MARKS: NonNullable<ClientLogoBadgeProps["mark"]>[] = [
  "square",
  "circle",
  "diamond",
  "bar",
  "ring",
  "triangle",
  "cross",
];

function pickMark(name: string): NonNullable<ClientLogoBadgeProps["mark"]> {
  // Stable hash → index
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return MARKS[h % MARKS.length];
}

function GeoMark({
  shape,
  size = 10,
  color = "currentColor",
}: {
  shape: NonNullable<ClientLogoBadgeProps["mark"]>;
  size?: number;
  color?: string;
}) {
  const s = size;
  const half = s / 2;
  switch (shape) {
    case "square":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <rect x="0" y="0" width={s} height={s} fill={color} />
        </svg>
      );
    case "circle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <circle cx={half} cy={half} r={half} fill={color} />
        </svg>
      );
    case "diamond":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <polygon points={`${half},0 ${s},${half} ${half},${s} 0,${half}`} fill={color} />
        </svg>
      );
    case "bar":
      return (
        <svg width={s + 2} height={s} viewBox={`0 0 ${s + 2} ${s}`} aria-hidden="true">
          <rect x="0" y={s * 0.35} width={s + 2} height={s * 0.3} fill={color} />
        </svg>
      );
    case "ring":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <circle cx={half} cy={half} r={half - 1.2} fill="none" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <polygon points={`${half},0 ${s},${s} 0,${s}`} fill={color} />
        </svg>
      );
    case "cross":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
          <rect x={half - 1} y="0" width="2" height={s} fill={color} />
          <rect x="0" y={half - 1} width={s} height="2" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

export function ClientLogoBadge({
  name,
  className,
  variant = "default",
  mark,
  index = 0,
}: ClientLogoBadgeProps) {
  const shape = mark ?? pickMark(name);
  const upperName = name.toUpperCase();

  // Slightly tighten the kerning for very long names so the marquee stays
  // visually consistent without ellipsizing.
  const tracking =
    upperName.replace(/\s/g, "").length > 14
      ? "tracking-[0.18em]"
      : "tracking-[0.24em]";

  if (variant === "minimal") {
    return (
      <motion.span
        className={cn(
          "inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap font-mono text-[12px] font-medium uppercase",
          tracking,
          className
        )}
        style={{ color: "var(--text-secondary)" }}
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          duration: 0.5,
          delay: 0.04 * (index % 8),
          ease: [0.16, 1, 0.3, 1],
        }}
        aria-label={`Logo client ${name}`}
      >
        <span
          className="inline-flex shrink-0 items-center justify-center"
          style={{ color: "var(--color-copper)" }}
        >
          <GeoMark shape={shape} size={9} />
        </span>
        <span>{upperName}</span>
      </motion.span>
    );
  }

  if (variant === "stamped") {
    return (
      <motion.div
        className={cn(
          "relative inline-flex h-12 shrink-0 items-center gap-3 px-5 whitespace-nowrap",
          className
        )}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "2px",
          color: "var(--text-secondary)",
        }}
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          duration: 0.5,
          delay: 0.05 * (index % 8),
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -2 }}
        aria-label={`Logo client ${name}`}
      >
        {/* Corner ticks */}
        <span
          className="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5"
          style={{ borderTop: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }}
        />
        <span
          className="pointer-events-none absolute right-1 top-1 h-1.5 w-1.5"
          style={{ borderTop: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }}
        />
        <span
          className="pointer-events-none absolute bottom-1 left-1 h-1.5 w-1.5"
          style={{ borderBottom: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }}
        />
        <span
          className="pointer-events-none absolute bottom-1 right-1 h-1.5 w-1.5"
          style={{ borderBottom: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }}
        />
        <span
          className="inline-flex shrink-0 items-center justify-center"
          style={{ color: "var(--color-copper)" }}
        >
          <GeoMark shape={shape} size={11} />
        </span>
        <span
          className={cn(
            "font-mono text-[12px] font-semibold uppercase",
            tracking
          )}
        >
          {upperName}
        </span>
      </motion.div>
    );
  }

  // default
  return (
    <motion.div
      className={cn(
        "group relative inline-flex h-9 shrink-0 items-center gap-2.5 rounded-md px-3.5 whitespace-nowrap transition-colors duration-300",
        className
      )}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.5,
        delay: 0.04 * (index % 8),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ borderColor: "var(--border-strong)" }}
      aria-label={`Logo client ${name}`}
    >
      <span
        className="inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ color: "var(--color-copper)" }}
      >
        <GeoMark shape={shape} size={9} />
      </span>
      <span
        className={cn(
          "font-mono text-[11.5px] font-medium uppercase transition-colors duration-300 group-hover:text-[var(--text)]",
          tracking
        )}
      >
        {upperName}
      </span>
    </motion.div>
  );
}

/**
 * ClientLogoRow
 *
 * Helper for marquee-style displays. Renders a horizontally-scrolling row
 * of badges with proper edge fades. Matches the existing ClientLogos.tsx API
 * so it can be used as a drop-in replacement.
 */
export function ClientLogoRow({
  names,
  reverse = false,
  variant = "minimal",
  speed = 50,
  gap = 56,
}: {
  names: string[];
  reverse?: boolean;
  variant?: Variant;
  /** Seconds per loop. */
  speed?: number;
  /** Gap between badges (px). */
  gap?: number;
}) {
  const tripled = [...names, ...names, ...names];
  return (
    <div className="relative overflow-hidden py-3">
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32"
        style={{
          background: "linear-gradient(to right, var(--bg), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32"
        style={{
          background: "linear-gradient(to left, var(--bg), transparent)",
        }}
      />
      <div
        className="flex items-center"
        style={{
          width: "max-content",
          gap: `${gap}px`,
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {tripled.map((name, i) => (
          <ClientLogoBadge
            key={`${name}-${i}`}
            name={name}
            variant={variant}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default ClientLogoBadge;
