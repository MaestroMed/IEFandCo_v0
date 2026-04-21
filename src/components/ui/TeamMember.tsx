"use client";

import { motion } from "motion/react";

interface TeamMemberProps {
  name: string;
  role: string;
  expertise: string;
  initials: string;
  index: number;
}

/**
 * Team member card with a stylized SVG avatar placeholder.
 * Avoids the embarrassment of fake photos — uses a designed monogram instead.
 */
export function TeamMember({ name, role, expertise, initials, index }: TeamMemberProps) {
  return (
    <motion.article
      className="flex flex-col overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border)", background: "var(--card-bg)", boxShadow: "var(--card-shadow)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Avatar area — designed monogram with technical accent */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-muted)" }}>
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Warm gradient glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(196, 133, 92, 0.15), transparent 60%)",
          }}
        />
        {/* Monogram */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span
              className="font-display text-7xl font-bold leading-none"
              style={{
                color: "var(--text)",
                letterSpacing: "-0.04em",
                textShadow: "0 0 40px rgba(196, 133, 92, 0.2)",
              }}
            >
              {initials}
            </span>
            {/* Corner brackets */}
            <svg className="absolute -top-3 -left-3 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M 1 5 L 1 1 L 5 1" stroke="var(--color-copper)" strokeWidth="1.2" />
            </svg>
            <svg className="absolute -top-3 -right-3 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M 11 1 L 15 1 L 15 5" stroke="var(--color-copper)" strokeWidth="1.2" />
            </svg>
            <svg className="absolute -bottom-3 -left-3 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M 1 11 L 1 15 L 5 15" stroke="var(--color-copper)" strokeWidth="1.2" />
            </svg>
            <svg className="absolute -bottom-3 -right-3 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M 15 11 L 15 15 L 11 15" stroke="var(--color-copper)" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
        {/* Top-left mono label */}
        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          IEF-{String(index + 1).padStart(3, "0")}
        </span>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>
          {name}
        </h3>
        <p className="mt-1 text-sm text-copper">{role}</p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {expertise}
        </p>
      </div>
    </motion.article>
  );
}
