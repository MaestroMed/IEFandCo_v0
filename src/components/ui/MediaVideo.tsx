"use client";

import { useReducedMotion } from "motion/react";

export interface MediaVideoProps {
  url: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  posterUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  style?: React.CSSProperties;
}

/**
 * Client-side video renderer. Splits out the use of `useReducedMotion()` so
 * the parent `<Media>` component can stay a server component when serving
 * an `<Image>`.
 *
 * WCAG 2.3.3 (Animation from Interactions) — when `prefers-reduced-motion: reduce`
 * is set, autoplay and loop are disabled and controls are exposed so the
 * user can opt-in to playback.
 */
export function MediaVideo({
  url,
  alt = "",
  className,
  fill,
  width,
  height,
  posterUrl,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  objectFit = "cover",
  objectPosition,
  style,
}: MediaVideoProps) {
  // useReducedMotion returns `boolean | null` (null = no preference yet) — coerce to boolean.
  const reduce = useReducedMotion() === true;

  // When reduced motion is requested : freeze the video on its poster, but
  // expose controls so the user can play it explicitly.
  const effectiveAutoPlay = autoPlay && !reduce;
  const effectiveLoop = loop && !reduce;
  const effectiveControls = controls || reduce;

  return (
    <video
      src={url}
      poster={posterUrl}
      autoPlay={effectiveAutoPlay}
      muted={muted}
      loop={effectiveLoop}
      playsInline
      controls={effectiveControls}
      preload="metadata"
      aria-label={alt || undefined}
      className={className}
      style={{
        ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}),
        ...(width && !fill ? { width } : {}),
        ...(height && !fill ? { height } : {}),
        objectFit,
        objectPosition,
        ...style,
      }}
    />
  );
}
