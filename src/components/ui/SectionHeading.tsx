"use client";

import { motion } from "motion/react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
}

export function SectionHeading({ title, subtitle, align = "center", as: Tag = "h2", className }: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("mb-12", align === "center" && "text-center", className)}>
      <motion.div
        className={cn("mb-4 h-[2px] w-12 bg-primary", align === "center" && "mx-auto")}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
        <Tag
          className={cn("font-display font-bold tracking-tight", Tag === "h2" ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl md:text-3xl")}
          style={{ color: "var(--text)" }}
        >
          {title}
        </Tag>
      </motion.div>
      {subtitle && (
        <motion.p
          className={cn("mt-4 max-w-2xl text-base leading-relaxed md:text-lg", align === "center" && "mx-auto")}
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
