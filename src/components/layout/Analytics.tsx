"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent, type ConsentState } from "./CookieBanner";

/**
 * Analytics — consent-gated analytics loader.
 *
 * Supports:
 *   - Plausible (NEXT_PUBLIC_PLAUSIBLE_DOMAIN) — loads regardless of consent because it's privacy-friendly (no PII)
 *   - Google Analytics 4 (NEXT_PUBLIC_GA4_ID) — requires analytics consent
 *
 * Listens to `iefco:consent-change` to load/unload scripts dynamically.
 */

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export function Analytics() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(getConsent());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      setConsent(detail);
    };
    window.addEventListener("iefco:consent-change", onChange);
    return () => window.removeEventListener("iefco:consent-change", onChange);
  }, []);

  const analyticsOk = consent?.analytics === true;

  return (
    <>
      {/* Plausible — always loads if domain set (no PII) */}
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          src="https://plausible.io/js/script.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      )}

      {/* Google Analytics 4 — only loads with analytics consent */}
      {GA4_ID && analyticsOk && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
