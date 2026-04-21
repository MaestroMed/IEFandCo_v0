"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface MetalCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function MetalCard({
  children,
  className,
  hoverEffect = true,
}: MetalCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hoverEffect || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -6);
    rotateY.set(x * 6);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-lg p-6 overflow-hidden brushed-steel",
        hoverEffect &&
          "transition-shadow duration-300",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        rotateX: hoverEffect ? springX : 0,
        rotateY: hoverEffect ? springY : 0,
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle metal texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, rgba(255,255,255,0.03) 1px, transparent 2px)",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
