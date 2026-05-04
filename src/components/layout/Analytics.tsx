"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent, type ConsentState } from "./CookieBanner";

/**
 * Analytics — consent-gated analytics loader.
 *
 * Supports:
 *   - Plausible (env NEXT_PUBLIC_PLAUSIBLE_DOMAIN, or DB setting `int:plausible-domain`).
 *     Loads regardless of consent because it's privacy-friendly (no PII).
 *   - Google Analytics 4 (NEXT_PUBLIC_GA4_ID) — requires analytics consent.
 *
 * The layout passes the DB-resolved Plausible domain via prop — env still
 * wins when set, otherwise the DB value is used. This lets the BO toggle
 * Plausible without redeploying.
 *
 * Listens to `iefco:consent-change` to load/unload scripts dynamically.
 */

const ENV_PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

interface Props {
  /** DB-stored Plausible domain (used as fallback when env is empty). */
  plausibleDomain?: string | null;
}

export function Analytics({ plausibleDomain }: Props = {}) {
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
  const resolvedPlausibleDomain = ENV_PLAUSIBLE_DOMAIN || (plausibleDomain && plausibleDomain.trim()) || null;

  return (
    <>
      {/* Plausible — always loads if domain set (no PII) */}
      {resolvedPlausibleDomain && (
        <Script
          defer
          src="https://plausible.io/js/script.js"
          data-domain={resolvedPlausibleDomain}
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
