"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * WorkshopAtmosphere — a lightweight decorative layer that evokes the
 * atmosphere of a working metal forge: subtle warm heat-haze, slow-breathing
 * copper ambiance and a faint horizon glow.
 *
 * Designed to sit behind content in dark sections (hero, CTA, bureau) as
 * a pointer-events-none background layer. It keeps the same reduced-motion
 * etiquette as the rest of the site: visible but static when the user opts
 * out of animation.
 *
 * Usage:
 *   <section className="section-forge-dark relative">
 *     <WorkshopAtmosphere />
 *     <content />
 *   </section>
 */

interface Props {
  /**
   * Controls the intensity of the haze/glow (0..1). Default 1. Lower values
   * keep the effect below the visual noise floor for content-dense sections.
   */
  intensity?: number;
  /** Which side the horizon glow rises from. Default "bottom". */
  origin?: "bottom" | "top" | "left" | "right";
  className?: string;
}

export function WorkshopAtmosphere({
  intensity = 1,
  origin = "bottom",
  className,
}: Props) {
  const reduce = useReducedMotion();

  // Horizon gradient direction
  const gradientDirection = {
    bottom: "ellipse 100% 55% at 50% 110%",
    top: "ellipse 100% 55% at 50% -10%",
    left: "ellipse 55% 100% at -10% 50%",
    right: "ellipse 55% 100% at 110% 50%",
  }[origin];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Warm horizon glow — copper breathing */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${gradientDirection}, rgba(196, 133, 92, ${0.12 * intensity}) 0%, transparent 60%)`,
        }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cooler counter-glow — very subtle red ember */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 55% 35% at 18% 82%, rgba(225, 16, 33, ${0.05 * intensity}) 0%, transparent 55%)`,
        }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.4, 0.9, 0.4],
              }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />

      {/* Heat haze — animated blurred scale transform, almost imperceptible */}
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background: "linear-gradient(to top, rgba(255, 170, 100, 0.04), transparent)",
            filter: "blur(18px)",
          }}
          animate={{
            scaleY: [1, 1.06, 1],
            opacity: [intensity * 0.7, intensity, intensity * 0.7],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
