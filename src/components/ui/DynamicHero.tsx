/**
 * Universal hero band that wraps every public-page hero and lets the BO
 * override the background photo, eyebrow, title and intro through the
 * `page_heroes` DB table.
 *
 * The component is server-only (it shells out to `getPageHero` which hits
 * the DB). When the DB has nothing for `pageKey` the component renders the
 * static fallbacks passed by the page — the result is identical to the
 * previous hardcoded heroes, so wiring a page to `<DynamicHero>` is a safe
 * no-op until the BO populates an override.
 *
 * Usage on a page :
 *
 *   <DynamicHero
 *     pageKey="services-index"
 *     fallbackImage="/images/photos/hero-services.jpg"
 *     fallbackEyebrow="Catalogue · 7 domaines d'expertise"
 *     fallbackTitle={<>Nos <span className="text-gradient-metal">services</span></>}
 *     fallbackIntro="De la conception à la maintenance..."
 *     breadcrumb={[
 *       { label: "Accueil", href: "/" },
 *       { label: "Services" },
 *     ]}
 *   />
 */

import Image from "next/image";
import Link from "next/link";
import { getPageHero } from "@/lib/content";
import type { ReactNode } from "react";

export interface DynamicHeroBreadcrumbItem {
  label: string;
  href?: string;
}

export interface DynamicHeroProps {
  /** Stable key that binds this hero to a row in the `page_heroes` table. */
  pageKey: string;
  /** Path under /public used when no DB override exists. */
  fallbackImage: string;
  /** Default copy / overrideable by the BO. */
  fallbackEyebrow?: string;
  fallbackTitle: ReactNode;
  fallbackIntro?: ReactNode;
  /** Breadcrumb links rendered above the title. */
  breadcrumb?: DynamicHeroBreadcrumbItem[];
  /** Optional CTA buttons rendered below the intro. */
  cta?: ReactNode;
  /** Inserted after the title block. Useful for status pills, urgency
   * banners, key facts etc. */
  belowIntro?: ReactNode;
  /** Default object-position when no DB override exists. */
  defaultObjectPosition?: string;
  /** Defaults baked into the page — overridden by DB if a row exists. */
  defaultOpacity?: number;
  defaultOverlayLeft?: number;
  /** Tailwind/section classnames extension. */
  sectionClassName?: string;
  /** Width container class — defaults to max-w-7xl. */
  containerMaxWidth?: string;
}

export async function DynamicHero({
  pageKey,
  fallbackImage,
  fallbackEyebrow,
  fallbackTitle,
  fallbackIntro,
  breadcrumb,
  cta,
  belowIntro,
  defaultObjectPosition = "center 50%",
  defaultOpacity = 100,
  defaultOverlayLeft = 70,
  sectionClassName = "",
  containerMaxWidth = "max-w-7xl",
}: DynamicHeroProps) {
  const override = await getPageHero(pageKey);

  // Resolve the final values : DB → static fallback.
  const eyebrow = override?.eyebrow ?? fallbackEyebrow;
  const title = override?.title ? <>{override.title}</> : fallbackTitle;
  const intro = override?.intro ? <>{override.intro}</> : fallbackIntro;
  const imageSrc = override?.imageUrl ?? fallbackImage;
  const objectPosition = override?.objectPosition ?? defaultObjectPosition;
  const opacity = (override?.opacity ?? defaultOpacity) / 100;
  const overlayLeftStrength = (override?.overlayLeft ?? defaultOverlayLeft) / 100;
  const isVideo = override?.imageMime?.startsWith("video/");

  return (
    <section
      className={`section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 ${sectionClassName}`}
    >
      {/* Branded background — DB override or static fallback */}
      <div className="absolute inset-0 pointer-events-none">
        {isVideo && override?.imageUrl ? (
          <video
            src={override.imageUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition,
              opacity,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={override?.imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition,
              opacity,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, ${overlayLeftStrength}) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)`,
          }}
        />
      </div>

      <div className={`relative z-10 mx-auto ${containerMaxWidth} px-6`}>
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "var(--text-muted)" }}
          >
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {item.href ? (
                  <Link href={item.href} className="hover:opacity-80">
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--color-copper)" }}>{item.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span style={{ color: "var(--border-strong)" }}>/</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: "var(--color-copper)" }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]"
          style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}
        >
          {title}
        </h1>

        {/* Intro */}
        {intro && (
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {intro}
          </p>
        )}

        {/* Optional CTAs */}
        {cta && <div className="mt-10 flex flex-wrap gap-4">{cta}</div>}

        {/* Optional inline content (status pills, key facts, etc.) */}
        {belowIntro && <div className="mt-10">{belowIntro}</div>}
      </div>
    </section>
  );
}
