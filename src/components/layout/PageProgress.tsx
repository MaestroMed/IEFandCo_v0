"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * PageProgress — thin top progress bar that fires on navigation.
 * Shows during route transition, completes when the new page has mounted.
 * Uses only React state + CSS transitions (no external deps).
 */
export function PageProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fired on every pathname change — means a navigation just completed
    setProgress(100);
    const hideT = window.setTimeout(() => {
      setVisible(false);
      const resetT = window.setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(resetT);
    }, 250);
    return () => clearTimeout(hideT);
  }, [pathname]);

  useEffect(() => {
    // Intercept link clicks to start the bar before Next finishes loading
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || a.target === "_blank") return;
      // Internal link → show the bar
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // Same page? no-op
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }
      setVisible(true);
      setProgress(20);
      // Step up progress to simulate loading
      const t1 = setTimeout(() => setProgress(45), 150);
      const t2 = setTimeout(() => setProgress(65), 400);
      const t3 = setTimeout(() => setProgress(80), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      style={{
        opacity: visible || progress > 0 ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, var(--color-copper) 0%, var(--color-primary) 100%)",
          boxShadow:
            "0 0 10px rgba(225, 16, 33, 0.6), 0 0 6px rgba(196, 133, 92, 0.4)",
          transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
