"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { navigation as staticNavigation, secondaryNavigation, companyInfo, type NavItem } from "@/data/navigation";

export function MobileMenu({ onClose, nav }: { onClose: () => void; nav?: NavItem[] }) {
  const navigation = nav && nav.length > 0 ? nav : staticNavigation;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      className="section-forge-dark fixed inset-0 z-[49] flex flex-col overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Living gradient background */}
      <div className="forge-gradient-dark" />
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header label */}
        <div className="mt-24 px-8 mb-8 flex items-center gap-3">
          <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
            Menu
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-8">
          {navigation.map((item, i) => (
            <div key={item.href}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-3 font-display text-2xl font-semibold transition-colors hover:text-primary"
                  style={{ color: "var(--text)" }}
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>
              {item.children && (
                <div className="ml-12 mb-2 flex flex-col gap-0.5">
                  {item.children.map((child, j) => (
                    <motion.div
                      key={child.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 + j * 0.03, duration: 0.3 }}
                    >
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-primary"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span className="h-1 w-1 rounded-full" style={{ background: "var(--color-copper)" }} />
                        {child.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <motion.div
          className="px-8 pb-12 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Secondary links (Contact + legal) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="transition-colors hover:text-primary"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Devis CTA */}
          <Link
            href="/devis"
            onClick={onClose}
            className="block w-full rounded-2xl bg-primary py-4 text-center font-display text-lg font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ boxShadow: "0 10px 30px rgba(225, 16, 33, 0.3)" }}
          >
            Demander un devis
          </Link>

          {/* Phone */}
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center justify-center gap-3 rounded-xl py-3 transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(196, 133, 92, 0.08)",
              border: "1px solid rgba(196, 133, 92, 0.2)",
              color: "var(--color-copper)",
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-mono text-sm">{companyInfo.phoneDisplay}</span>
          </a>

          {/* Certifications mini-bar */}
          <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <span>EN 1090</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>Eurocode 3</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>EN 13241</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
