"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { companyInfo } from "@/data/navigation";

/**
 * StickyMobileCTA — fixed bottom bar visible on mobile only.
 * Two CTAs: emergency phone + devis. Hides when scrolled to footer.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let rafId = 0;
    const check = () => {
      rafId = 0;
      const footer = document.querySelector("footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      // Hide when footer is partially visible
      setVisible(rect.top > window.innerHeight - 80);
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{
        background: "rgba(5, 5, 8, 0.95)",
        borderTop: "1px solid rgba(196, 133, 92, 0.25)",
        boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255, 255, 255, 0.08)" }}>
        <a
          href={`tel:${companyInfo.phone}`}
          className="flex items-center justify-center gap-2.5 py-4 transition-colors active:bg-white/5"
          style={{ background: "rgba(5, 5, 8, 0.95)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }}>
            <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <div className="text-left">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] leading-none" style={{ color: "var(--color-copper)" }}>
              Appel
            </div>
            <div className="font-display text-sm font-semibold leading-tight" style={{ color: "#F5F5F2" }}>
              Dépannage 24/7
            </div>
          </div>
        </a>
        <Link
          href="/devis"
          className="flex items-center justify-center gap-2.5 py-4 active:opacity-90"
          style={{ background: "var(--color-primary)", color: "#FFFFFF" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          <div className="text-left">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] leading-none opacity-80">
              Étude gratuite
            </div>
            <div className="font-display text-sm font-semibold leading-tight">
              Demander un devis
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
