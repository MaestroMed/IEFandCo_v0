"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Testimonial } from "@/data/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-5 w-5"
          style={{ color: i < rating ? "var(--color-copper)" : "rgba(140, 90, 58, 0.2)" }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  if (testimonials.length === 0) return null;
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-forge-warm relative overflow-hidden py-28 md:py-36">
      {/* Warm living gradient */}
      <div className="forge-gradient-warm" />
      {/* Grain overlay */}
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Témoignages
            </span>
            <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.5rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Ce que nos clients
            <br />
            <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>racontent</span>
          </h2>
        </div>

        {/* Quote card — editorial */}
        <div className="relative mx-auto max-w-4xl">
          {/* Big decorative quote mark */}
          <div
            className="absolute -top-10 -left-4 font-display text-[180px] leading-none select-none md:-left-16 md:text-[260px] pointer-events-none"
            style={{ color: "rgba(140, 90, 58, 0.12)" }}
            aria-hidden
          >
            &ldquo;
          </div>

          <div
            className="relative rounded-3xl p-10 md:p-14 glass-card-warm"
            style={{
              boxShadow: "0 2px 8px rgba(92,65,35,0.06), 0 20px 60px rgba(92,65,35,0.08)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <Stars rating={testimonials[current].rating} />

                <blockquote
                  className="mt-6 font-display text-xl font-medium leading-relaxed md:text-2xl lg:text-3xl lg:leading-[1.35]"
                  style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}
                >
                  {testimonials[current].text}
                </blockquote>

                {/* Divider */}
                <div className="mt-10 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(140, 90, 58, 0.25), transparent)" }} />

                <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(196, 133, 92, 0.2) 0%, rgba(212, 165, 116, 0.1) 100%)",
                        border: "1px solid rgba(196, 133, 92, 0.3)",
                      }}
                    >
                      <span className="font-display text-base font-bold" style={{ color: "var(--color-copper)" }}>
                        {testimonials[current].name.split(" ").map(w => w[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-semibold" style={{ color: "var(--text)" }}>{testimonials[current].name}</p>
                      {testimonials[current].company && (
                        <p className="text-sm font-mono uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>{testimonials[current].company}</p>
                      )}
                    </div>
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                    {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                background: "rgba(255, 252, 245, 0.6)",
                border: "1px solid rgba(140, 90, 58, 0.25)",
                color: "var(--color-copper)",
              }}
              aria-label="Précédent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: i === current ? "2.5rem" : "0.5rem",
                    background: i === current ? "var(--color-copper)" : "rgba(140, 90, 58, 0.25)",
                  }}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                background: "rgba(255, 252, 245, 0.6)",
                border: "1px solid rgba(140, 90, 58, 0.25)",
                color: "var(--color-copper)",
              }}
              aria-label="Suivant"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
