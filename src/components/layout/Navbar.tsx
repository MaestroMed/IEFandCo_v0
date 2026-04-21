"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useScrolledPast } from "@/hooks/useScrollProgress";
import { navigation, companyInfo, type NavItem } from "@/data/navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

function ServicesDropdown({ items }: { items: NavItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[320px] rounded-2xl p-2 overflow-hidden"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 20px 80px rgba(0, 0, 0, 0.12)",
        backdropFilter: "none",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-copper) 30%, var(--color-copper) 70%, transparent)",
          opacity: 0.4,
        }}
      />
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-muted)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] w-6 shrink-0" style={{ color: "var(--color-copper)", opacity: 0.7 }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1">{item.label}</span>
          <svg
            className="h-3 w-3 opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ color: "var(--color-copper)" }}
            aria-hidden="true"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      ))}
    </motion.div>
  );
}

// Pixar-style bouncy spring for each letter
const pixarSpring = { type: "spring" as const, stiffness: 400, damping: 12, mass: 0.8 };

function AnimatedLogo() {
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Only animate on first mount
    setHasPlayed(true);
  }, []);

  const letters = [
    { char: "I", delay: 0.5 },
    { char: "E", delay: 0.8 },
    { char: "F", delay: 1.1 },
    { char: "&", delay: 1.5 },
    { char: "C", delay: 1.9 },
    { char: "O", delay: 2.2 },
  ];

  return (
    <Link href="/" className="relative z-10 inline-flex items-baseline" aria-label="IEF & CO — Accueil">
      {letters.map((letter, i) => {
        const isAmp = letter.char === "&";
        return (
          <motion.span
            key={i}
            className={cn(
              "font-display text-2xl font-bold inline-block",
              isAmp ? "text-primary mx-[1px]" : ""
            )}
            style={
              !isAmp
                ? {
                    color: "inherit",
                    // Subtle text-shadow only improves legibility over complex bg (Hero charpente)
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
                  }
                : undefined
            }
            initial={hasPlayed ? false : {
              x: 80,
              y: -20,
              opacity: 0,
              scale: 0.3,
              rotate: 15,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              delay: letter.delay,
              ...pixarSpring,
              // Each property can overshoot differently for that Pixar feel
              scale: { delay: letter.delay, type: "spring", stiffness: 500, damping: 10, mass: 0.6 },
              rotate: { delay: letter.delay, type: "spring", stiffness: 300, damping: 15 },
              opacity: { delay: letter.delay, duration: 0.15 },
            }}
          >
            {letter.char}
          </motion.span>
        );
      })}
    </Link>
  );
}

export function Navbar() {
  const scrolled = useScrolledPast(80);
  const pathname = usePathname();
  // Track which specific dropdown is open (by href). `null` = none open.
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [themeClass, setThemeClass] = useState<"light" | "dark">("dark");
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleDropdownEnter = (href: string) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(href);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* Watch html theme class so we re-render navbar colors when user toggles theme */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const readTheme = (): "light" | "dark" =>
      html.classList.contains("light") ? "light" : "dark";
    setThemeClass(readTheme());
    const obs = new MutationObserver(() => setThemeClass(readTheme()));
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* Detect whether navbar is over a forge-dark / forge-light section */
  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId = 0;
    let sections: { el: HTMLElement; isDark: boolean }[] = [];

    const refreshSections = () => {
      const all = Array.from(
        document.querySelectorAll<HTMLElement>("[class*='section-forge-']")
      );
      sections = all.map((el) => ({
        el,
        isDark:
          el.className.includes("section-forge-dark") ||
          el.className.includes("section-forge-transition"),
      }));
    };

    const check = () => {
      rafId = 0;
      if (sections.length === 0) refreshSections();
      const probeY = 50;
      let active: typeof sections[number] | null = null;
      for (const s of sections) {
        const r = s.el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          active = s;
          break;
        }
      }
      if (active) {
        setOverDark(active.isDark);
      } else {
        const first = sections[0];
        if (first && first.el.getBoundingClientRect().top > probeY) {
          setOverDark(first.isDark);
        } else {
          setOverDark(false);
        }
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(check);
    };

    refreshSections();
    check();
    // Multi-pass initial: sections appear progressively as client components hydrate
    const timers = [100, 300, 800].map((ms) =>
      window.setTimeout(() => {
        refreshSections();
        check();
      }, ms)
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* Adaptive colors — maximized contrast across all 4 states
     (dark-theme-over-dark / dark-theme-over-light / light-theme-over-dark / light-theme-over-light)
  */
  const isLight = themeClass === "light";

  // Text colors — when over a dark section, use PURE WHITE for max legibility
  const navTextPrimary = overDark ? "#FFFFFF" : "var(--text)";
  // Bumped from 0.72 → 0.85 so menu labels have real presence on dark backgrounds
  const navTextSecondary = overDark
    ? "rgba(255, 255, 255, 0.85)"
    : "var(--text-secondary)";
  const navBarsColor = overDark ? "#FFFFFF" : "var(--text)";
  const navMutedOnDark = overDark
    ? "rgba(255, 255, 255, 0.55)"
    : "var(--text-muted)";

  // Scrolled background — matches the section's native dark (warm graphite in light, near-black in dark)
  const bgWhenScrolled = overDark
    ? isLight
      ? "rgba(31, 27, 23, 0.95)" // warm graphite (matches .light .section-forge-dark)
      : "rgba(5, 5, 8, 0.95)" // near-black
    : isLight
      ? "rgba(250, 250, 248, 0.96)"
      : "rgba(10, 10, 12, 0.92)";

  const borderWhenScrolled = overDark
    ? "1px solid rgba(255, 255, 255, 0.10)"
    : "1px solid var(--nav-border)";

  return (
    <>
      <header
        className={cn("fixed top-0 left-0 right-0 z-50", scrolled ? "shadow-sm" : "")}
        style={{
          backgroundColor: scrolled ? bgWhenScrolled : "transparent",
          borderBottom: scrolled ? borderWhenScrolled : "1px solid transparent",
          transition:
            "background-color 350ms cubic-bezier(0.4, 0, 0.2, 1), border-color 350ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div style={{ color: navTextPrimary, transition: "color 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
            <AnimatedLogo />
          </div>

          {/* Primary nav — 5 items, centered, breathing room */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const isOpen = openDropdown === item.href;
              return item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.href)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group/nav relative px-4 py-2 text-[13px] font-semibold tracking-[0.01em] transition-colors duration-[var(--dur-md)] hover:text-[var(--color-primary)]"
                    style={{ color: active ? navTextPrimary : navTextSecondary }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {item.label}
                      <svg className={cn("h-3 w-3 transition-transform duration-[var(--dur-sm)]", isOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path d="M19 9l-7 7-7-7" /></svg>
                    </span>
                    {/* Sliding underline indicator */}
                    <span
                      className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-[2px] origin-center transition-transform duration-[var(--dur-md)] ease-[var(--ease-out-quart)]"
                      style={{
                        background: "var(--color-primary)",
                        transform: (active || isOpen) ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </Link>
                  <AnimatePresence>{isOpen && <ServicesDropdown items={item.children} />}</AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group/nav relative px-4 py-2 text-[13px] font-semibold tracking-[0.01em] transition-colors duration-[var(--dur-md)] hover:text-[var(--color-primary)]"
                  style={{ color: active ? navTextPrimary : navTextSecondary }}
                >
                  {item.label}
                  <span
                    className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-[2px] origin-center transition-transform duration-[var(--dur-md)] ease-[var(--ease-out-quart)] scale-x-0 group-hover/nav:scale-x-100"
                    style={{
                      background: "var(--color-primary)",
                      transform: active ? "scaleX(1)" : undefined,
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right side: phone (xl+) · theme · CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Phone number — trust signal, hidden on smaller desktop to save space */}
            <a
              href={`tel:${companyInfo.phone}`}
              className="hidden xl:inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[12px] tracking-[0.04em] transition-colors duration-[var(--dur-md)]"
              style={{ color: navTextSecondary }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = navTextSecondary; }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {companyInfo.phoneDisplay}
            </a>

            {/* Divider, xl+ only */}
            <span className="hidden xl:block h-4 w-px" style={{ background: navMutedOnDark, opacity: 0.4 }} aria-hidden="true" />

            {/* Contact as ghost link — lower weight than devis CTA but always visible */}
            <Link
              href="/contact"
              aria-current={isActive("/contact") ? "page" : undefined}
              className="inline-flex items-center rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors duration-[var(--dur-md)] hover:text-[var(--color-primary)]"
              style={{ color: isActive("/contact") ? navTextPrimary : navTextSecondary }}
            >
              Contact
            </Link>

            <div style={{ color: navTextPrimary, transition: "color 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <ThemeToggle />
            </div>
            <Link
              href="/devis"
              className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white overflow-hidden group transition-all duration-[var(--dur-md)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5"
              style={{ boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)" }}
            >
              <span className="relative z-10">Demander un devis</span>
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  backgroundSize: "220% 100%",
                  animation: "metal-shine 1.8s ease-in-out infinite",
                }}
              />
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <div style={{ color: navTextPrimary, transition: "color 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
              <ThemeToggle />
            </div>
            <button className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}>
              <motion.span className="block h-0.5 w-6" style={{ backgroundColor: navBarsColor }} animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
              <motion.span className="block h-0.5 w-6" style={{ backgroundColor: navBarsColor }} animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} />
              <motion.span className="block h-0.5 w-6" style={{ backgroundColor: navBarsColor }} animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>{mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </>
  );
}
