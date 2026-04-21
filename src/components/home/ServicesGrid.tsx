"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Service } from "@/data/services";

const iconMap: Record<string, React.ReactNode> = {
  factory: <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />,
  gate: <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1" />,
  building: <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />,
  window: <path d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18" />,
  flame: <><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></>,
  cpu: <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />,
  wrench: <path d="M11.42 15.17l-5.1 5.1a2.121 2.121 0 01-3-3l5.1-5.1M18.36 8.04l-3.53 3.53M15.54 12.29l5.66-5.66a2.121 2.121 0 00-3-3l-5.66 5.66" />,
};

// Bento grid — 7 services arranged as: one tall (featured) + 6 standard
// col-span controls horizontal extent, row-span controls height
// Layout on lg (3 cols): [tall][std][std] / [wide-2][std] / [std][std]
const bentoLayout = [
  "sm:col-span-1 lg:col-span-1 lg:row-span-2", // factory — featured tall
  "sm:col-span-1 lg:col-span-1 lg:row-span-1", // gate
  "sm:col-span-2 lg:col-span-1 lg:row-span-1", // building
  "sm:col-span-2 lg:col-span-2 lg:row-span-1", // window — wide
  "sm:col-span-2 lg:col-span-1 lg:row-span-1", // flame
  "sm:col-span-1 lg:col-span-1 lg:row-span-1", // cpu
  "sm:col-span-1 lg:col-span-2 lg:row-span-1", // wrench — wide
];

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section className="section-forge-light relative overflow-hidden py-28 md:py-36">
      {/* Ambient warm gradient blob — top right, very soft */}
      <div className="forge-gradient-light" />
      {/* Subtle grain */}
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section heading — left-aligned editorial */}
        <div className="mb-14 grid items-end gap-6 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Nos savoir-faire
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.5rem] leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              De la conception
              <br />
              <span className="text-gradient-metal">à la maintenance</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Sept expertises complémentaires, un seul interlocuteur.
            Chaque réalisation est pensée, calculée, forgée et posée par nos équipes.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const isFeature = i === 0;
            const isWide = i === 3 || i === 6;
            return (
              <motion.div
                key={service.slug}
                className={bentoLayout[i] || "col-span-1 row-span-1"}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/services/${service.slug}`} className="group block h-full">
                  <div
                    className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 transition-all duration-500 group-hover:-translate-y-1"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)"; }}
                  >
                    {/* Hover warm gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196, 133, 92, 0.08) 0%, transparent 70%)",
                      }}
                    />

                    {/* Index + icon row */}
                    <div className="relative flex items-start justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: "linear-gradient(135deg, rgba(196, 133, 92, 0.15) 0%, rgba(212, 165, 116, 0.08) 100%)",
                          border: "1px solid rgba(196, 133, 92, 0.2)",
                        }}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--color-copper)" }}>
                          {iconMap[service.icon]}
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                        {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title + description */}
                    <div className="relative mt-auto">
                      <h3 className={`font-display font-bold leading-tight tracking-tight ${isFeature ? "text-2xl md:text-3xl" : isWide ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`} style={{ color: "var(--text)" }}>
                        {service.shortTitle}
                      </h3>
                      <p className={`mt-2 leading-relaxed ${isFeature || isWide ? "text-sm md:text-base line-clamp-3" : "text-sm line-clamp-2"}`} style={{ color: "var(--text-secondary)" }}>
                        {service.shortDescription}
                      </p>

                      {/* Arrow CTA */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium transition-colors duration-300" style={{ color: "var(--color-copper)" }}>
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Découvrir</span>
                        <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: "linear-gradient(90deg, var(--color-copper), var(--color-primary))" }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom link to all services */}
        <div className="mt-14 flex items-center justify-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="h-px w-12 transition-all duration-300 group-hover:w-16" style={{ background: "var(--color-copper)" }} />
            Voir l&apos;ensemble des services
            <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
