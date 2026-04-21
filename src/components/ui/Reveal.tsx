"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** Animation style */
  variant?: "up" | "fade" | "left" | "right";
  /** Once only (default true) */
  once?: boolean;
  className?: string;
  as?: "div" | "span" | "section" | "article" | "li";
}

/**
 * Reveal — smooth viewport-triggered entrance animation.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  once = true,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();

  const initial =
    variant === "up"
      ? { opacity: 0, y: 24 }
      : variant === "fade"
      ? { opacity: 0 }
      : variant === "left"
      ? { opacity: 0, x: -24 }
      : { opacity: 0, x: 24 };

  const animate = reduced ? { opacity: 1, y: 0, x: 0 } : undefined;

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 1 } : initial}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, x: 0 }}
      animate={animate}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}

/**
 * RevealStagger — wraps a list of children with staggered entrance.
 */
export function RevealStagger({
  children,
  staggerDelay = 0.08,
  once = true,
  className,
}: {
  children: ReactNode;
  staggerDelay?: number;
  once?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}
