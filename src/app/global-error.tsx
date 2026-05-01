"use client";

/**
 * Root error boundary — catches errors that escape `error.tsx` (i.e. errors
 * that happen INSIDE the root layout itself). Without this, Next.js falls
 * back to a stark white page with the raw error message in dev and an empty
 * page in production.
 *
 * Renders its own minimal `<html>` and `<body>` (the root layout is bypassed —
 * which is also why we use a plain `<a>` for the home link below : the Next
 * routing context isn't available here).
 */

/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to Sentry / log stream when wired (no-op otherwise — handled
    // by `instrumentation.ts` in production).
    if (typeof window !== "undefined") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#050508",
          color: "#F5F5F2",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2.5rem",
            opacity: 0.65,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          }}
        >
          <span style={{ width: 32, height: 1, background: "#C4855C" }} />
          <span style={{ color: "#C4855C" }}>Erreur inattendue</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          On a un souci.
        </h1>

        <p
          style={{
            marginTop: "1.5rem",
            maxWidth: 460,
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "rgba(245, 245, 242, 0.72)",
          }}
        >
          Quelque chose a cassé de notre côté. On en est informés. Essayez de
          recharger la page, ou revenez à l&apos;accueil.
        </p>

        {error.digest && (
          <p
            style={{
              marginTop: "1.25rem",
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
              fontSize: "0.7rem",
              color: "rgba(196, 133, 92, 0.7)",
              padding: "0.4rem 0.8rem",
              border: "1px solid rgba(196, 133, 92, 0.25)",
              borderRadius: 8,
            }}
          >
            ref : {error.digest}
          </p>
        )}

        <div
          style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <button
            onClick={reset}
            style={{
              background: "#E11021",
              color: "#fff",
              border: "none",
              padding: "0.85rem 1.5rem",
              borderRadius: 12,
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)",
            }}
          >
            Réessayer
          </button>
          <a
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              color: "#F5F5F2",
              padding: "0.85rem 1.5rem",
              borderRadius: 12,
              fontSize: "0.95rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </body>
    </html>
  );
}
