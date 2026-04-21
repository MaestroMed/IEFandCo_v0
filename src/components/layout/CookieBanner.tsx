"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

/**
 * CookieBanner — RGPD-compliant cookie consent banner.
 *
 * Strictly necessary cookies (session) are always on.
 * User opts in per category: analytics, marketing.
 * Choice persisted in localStorage; consent event dispatched for other components
 * (analytics loader, marketing pixels) to react.
 *
 * Fires a `iefco:consent-change` CustomEvent on choice so the rest of the app
 * (e.g. Analytics) can load or unload scripts accordingly.
 */

export type ConsentState = {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const STORAGE_KEY = "iefco-consent-v1";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || !parsed) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: Number(parsed.timestamp) || Date.now(),
    };
  } catch {
    return null;
  }
}

function saveConsent(c: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent("iefco:consent-change", { detail: c }));
  } catch {
    // Ignore storage errors (Safari private mode, etc.)
  }
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [detailed, setDetailed] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      // Show banner after 500ms to let the page paint first
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
    setOpen(false);
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
    setOpen(false);
  };

  const saveChoices = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: Date.now(),
    });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[70] lg:bottom-4 lg:left-4 lg:right-auto lg:max-w-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
        >
          <div
            className="m-3 lg:m-0 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(5, 5, 8, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                <h2
                  id="cookie-title"
                  className="font-mono text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--color-copper)" }}
                >
                  Cookies & confidentialité
                </h2>
              </div>

              <p id="cookie-desc" className="text-sm leading-relaxed mb-5" style={{ color: "rgba(245, 245, 242, 0.85)" }}>
                Nous utilisons des cookies pour faire fonctionner le site (session) et, avec votre accord,
                mesurer l&apos;audience pour améliorer nos contenus. Aucun cookie publicitaire tiers.
              </p>

              {detailed && (
                <div className="space-y-3 mb-5 rounded-xl p-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  {/* Necessary (always on) */}
                  <label className="flex items-start gap-3 cursor-not-allowed opacity-70">
                    <input type="checkbox" checked disabled className="mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#F5F5F2" }}>
                        Essentiels
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(245, 245, 242, 0.6)" }}>
                        Session, préférence de thème, panier. Obligatoires pour le fonctionnement.
                      </div>
                    </div>
                  </label>

                  {/* Analytics */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="mt-0.5 accent-[var(--color-copper)]"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#F5F5F2" }}>
                        Mesure d&apos;audience
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(245, 245, 242, 0.6)" }}>
                        Statistiques anonymes (pages vues, durée). Aucune donnée personnelle.
                      </div>
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="mt-0.5 accent-[var(--color-copper)]"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: "#F5F5F2" }}>
                        Marketing
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(245, 245, 242, 0.6)" }}>
                        Retargeting publicitaire (LinkedIn, Google Ads). Off par défaut.
                      </div>
                    </div>
                  </label>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={acceptAll}
                  className="flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: "var(--color-primary)",
                    color: "white",
                    boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)",
                  }}
                >
                  Accepter
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-semibold transition-colors"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "rgba(245, 245, 242, 0.9)",
                  }}
                >
                  Refuser
                </button>
                {detailed ? (
                  <button
                    onClick={saveChoices}
                    className="flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(196, 133, 92, 0.5)",
                      color: "var(--color-copper)",
                    }}
                  >
                    Enregistrer mes choix
                  </button>
                ) : (
                  <button
                    onClick={() => setDetailed(true)}
                    className="rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
                    style={{ color: "var(--color-copper)" }}
                  >
                    Personnaliser
                  </button>
                )}
              </div>

              <p className="mt-4 text-[11px]" style={{ color: "rgba(245, 245, 242, 0.5)" }}>
                En savoir plus dans notre{" "}
                <Link href="/politique-confidentialite" className="underline decoration-[var(--color-copper)] underline-offset-2">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
