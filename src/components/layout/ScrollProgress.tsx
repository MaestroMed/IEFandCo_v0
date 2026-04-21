"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[51]"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
        boxShadow: "0 0 8px var(--color-primary), 0 0 4px var(--color-accent)",
      }}
    />
  );
}
