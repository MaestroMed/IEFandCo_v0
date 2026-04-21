"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FAQItem } from "@/data/faq";
import { generateFAQSchema } from "@/lib/seo";
import Link from "next/link";

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);
  const schema = generateFAQSchema(items);

  return (
    <section className="section-forge-light relative overflow-hidden py-28 md:py-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Ambient light gradient */}
      <div className="forge-gradient-light" style={{ opacity: 0.7 }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Editorial split heading */}
        <div className="mb-14 grid items-end gap-8 md:grid-cols-5 md:gap-16">
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Questions fréquentes
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.5rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Les réponses
              <br />
              <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>à vos questions</span>
            </h2>
          </div>
          <div className="md:col-span-2">
            <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
              Une interrogation plus spécifique&nbsp;?
              <Link href="/contact" className="ml-1 font-medium underline decoration-[var(--color-primary)] decoration-2 underline-offset-4 transition-colors" style={{ color: "var(--text)" }}>
                Notre équipe vous répond en 24h.
              </Link>
            </p>
          </div>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  background: isOpen ? "var(--card-bg)" : "rgba(255, 255, 255, 0.6)",
                  border: `1px solid ${isOpen ? "rgba(196, 133, 92, 0.3)" : "var(--border)"}`,
                  boxShadow: isOpen ? "var(--card-shadow-hover)" : "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] shrink-0 mt-0.5" style={{ color: isOpen ? "var(--color-primary)" : "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-display text-base font-semibold md:text-lg transition-colors duration-300`} style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      background: isOpen ? "var(--color-copper)" : "transparent",
                      border: `1px solid ${isOpen ? "var(--color-copper)" : "rgba(196, 133, 92, 0.3)"}`,
                      color: isOpen ? "#FFFFFF" : "var(--color-copper)",
                    }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-7">
                        <div className="ml-0 md:ml-9 pl-4 border-l-2" style={{ borderColor: "rgba(196, 133, 92, 0.3)" }}>
                          <p className="text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom prompt */}
        <div className="mt-14 flex items-center justify-center">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-all hover:scale-105"
            style={{
              background: "var(--text)",
              color: "var(--bg)",
            }}
          >
            Poser une autre question
            <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
