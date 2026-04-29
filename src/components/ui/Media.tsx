/**
 * Media — polymorphic image/video renderer.
 *
 * Picks `<video>` if the MIME starts with `video/`, otherwise `<Image>` from
 * next/image. Designed for use as a hero/cover background (fill mode) or as
 * a fixed-size thumbnail.
 *
 * Server component by default; pass `client` if you need event handlers.
 */

import Image from "next/image";

export interface MediaProps {
  url: string;
  /** MIME type — drives image vs video rendering. */
  mime?: string;
  alt?: string;
  className?: string;
  /** Fill the parent (parent must be `position: relative` with dimensions). */
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  /** For `<video>`: poster image URL (shown before play). */
  posterUrl?: string;
  /** For `<video>`: defaults true (auto-play required muted). */
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** CSS object-fit (default: cover). */
  objectFit?: "cover" | "contain";
  /** CSS object-position. */
  objectPosition?: string;
  style?: React.CSSProperties;
}

function isVideo(mime?: string, url?: string): boolean {
  if (mime?.startsWith("video/")) return true;
  if (!mime && url) {
    const lower = url.toLowerCase();
    return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov");
  }
  return false;
}

export function Media({
  url,
  mime,
  alt = "",
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  posterUrl,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  objectFit = "cover",
  objectPosition,
  style,
}: MediaProps) {
  const video = isVideo(mime, url);

  if (video) {
    return (
      <video
        src={url}
        poster={posterUrl}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
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

  // Default to next/image
  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={className}
        style={{ objectFit, objectPosition, ...style }}
      />
    );
  }
  return (
    <Image
      src={url}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      priority={priority}
      sizes={sizes}
      className={className}
      style={{ objectFit, objectPosition, ...style }}
    />
  );
}
