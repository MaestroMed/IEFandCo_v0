"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setDark(false);
    } else if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="group relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        transition: "border-color var(--dur-sm) var(--ease-out-quart), background-color var(--dur-sm) var(--ease-out-quart), color var(--dur-sm) var(--ease-out-quart)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(196, 133, 92, 0.4)";
        e.currentTarget.style.color = "var(--color-copper)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {/* Subtle radial highlight on hover */}
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-[var(--dur-md)] group-hover:opacity-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(196, 133, 92, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Icon crossfade */}
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={dark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex"
          >
            {dark ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
