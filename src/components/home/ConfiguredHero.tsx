/**
 * ConfiguredHero — DB-driven homepage hero.
 *
 * Renders only when an admin has enabled and configured the homepage_hero
 * row. Supports both image and video backgrounds via the polymorphic Media
 * component. If `homepage_hero.enabled` is false (or no row exists), the
 * page falls back to the coded `<HeroSection>` component.
 */

import Link from "next/link";
import { Media } from "@/components/ui/Media";
import type { HeroConfig } from "@/lib/content";

export function ConfiguredHero({
  eyebrow,
  title,
  subtitle,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  mediaUrl,
  mediaMime,
  posterUrl,
  overlayOpacity,
}: HeroConfig) {
  // Enforce minimum 50% overlay so that white text always meets WCAG AA
  // contrast (4.5:1) over any photo / video background. Admin can push it
  // higher for dimmer mood, never below.
  const overlay = Math.max(50, Math.min(100, overlayOpacity)) / 100;

  return (
    <section className="section-forge-dark relative flex min-h-screen items-center overflow-hidden">
      {/* Background media (image or video) */}
      {mediaUrl && (
        <div className="absolute inset-0 pointer-events-none">
          <Media
            url={mediaUrl}
            mime={mediaMime}
            posterUrl={posterUrl}
            alt={title || ""}
            fill
            priority
            autoPlay
            muted
            loop
            sizes="100vw"
            objectFit="cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `rgba(5, 5, 8, ${overlay})` }}
          />
        </div>
      )}

      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-24 md:py-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <p
                className="font-mono text-[11px] uppercase tracking-[0.35em]"
                style={{ color: "var(--color-copper)" }}
              >
                {eyebrow}
              </p>
            </div>
          )}

          {title && (
            <h1
              className="font-display font-bold leading-[0.95] tracking-[-0.03em] whitespace-pre-line"
              style={{
                color: "var(--text)",
                fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                textWrap: "balance",
              } as React.CSSProperties}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              {subtitle}
            </p>
          )}

          {(ctaPrimaryLabel || ctaSecondaryLabel) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {ctaPrimaryLabel && ctaPrimaryHref && (
                <Link
                  href={ctaPrimaryHref}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ boxShadow: "0 6px 20px rgba(225, 16, 33, 0.25)" }}
                >
                  {ctaPrimaryLabel}
                </Link>
              )}
              {ctaSecondaryLabel && ctaSecondaryHref && (
                <Link
                  href={ctaSecondaryHref}
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    color: "var(--text)",
                  }}
                >
                  {ctaSecondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
