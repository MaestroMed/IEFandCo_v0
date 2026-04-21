import Image from "next/image";

interface PhotoProps {
  src: string;
  alt: string;
  /** Apply a copper/warm tint overlay (default: true) */
  tint?: boolean;
  /** Treatment: "default" | "moody" | "raw" — moody adds heavy contrast/desat, raw leaves untouched */
  treatment?: "default" | "moody" | "raw";
  /** Object position (default: "center") */
  position?: string;
  /** Aspect class (e.g. "aspect-[4/3]"). Omit if parent controls sizing. */
  aspect?: string;
  /** Hover scale effect (default: true) */
  hoverZoom?: boolean;
  /** Add corner brackets (default: false) */
  brackets?: boolean;
  /** Mono caption to overlay top-left, e.g. "PROJ-01" */
  caption?: string;
  /** Optional priority loading */
  priority?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
  className?: string;
}

/**
 * Photo — wraps next/image with Forged Light treatment:
 *  - subtle desaturation + contrast bump
 *  - optional warm copper tint overlay
 *  - optional corner brackets + caption (blueprint chrome)
 *  - smooth hover zoom
 */
export function Photo({
  src,
  alt,
  tint = true,
  treatment = "default",
  position = "center",
  aspect,
  hoverZoom = true,
  brackets = false,
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  className = "",
}: PhotoProps) {
  const filter =
    treatment === "moody"
      ? "grayscale(0.4) contrast(1.15) brightness(0.85)"
      : treatment === "raw"
      ? "none"
      : "saturate(0.95) contrast(1.05)";

  return (
    <div className={`relative overflow-hidden ${aspect || ""} ${className}`}>
      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${hoverZoom ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""}`}
        style={{ objectPosition: position, filter }}
      />

      {/* Warm tint overlay */}
      {tint && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(196, 133, 92, 0.18) 0%, transparent 60%), linear-gradient(180deg, transparent 50%, rgba(5, 5, 8, 0.45) 100%)",
          }}
        />
      )}

      {/* Bottom darken for text legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(5, 5, 8, 0.4) 100%)",
        }}
      />

      {/* Corner brackets */}
      {brackets && (
        <>
          <svg className="absolute top-3 left-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
            <path d="M2 8V2h6" stroke="rgba(196, 133, 92, 0.85)" strokeWidth="1.4" />
          </svg>
          <svg className="absolute top-3 right-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
            <path d="M12 2h6v6" stroke="rgba(196, 133, 92, 0.85)" strokeWidth="1.4" />
          </svg>
          <svg className="absolute bottom-3 left-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
            <path d="M2 12v6h6" stroke="rgba(196, 133, 92, 0.85)" strokeWidth="1.4" />
          </svg>
          <svg className="absolute bottom-3 right-3 h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="none">
            <path d="M18 12v6h-6" stroke="rgba(196, 133, 92, 0.85)" strokeWidth="1.4" />
          </svg>
        </>
      )}

      {/* Mono caption */}
      {caption && (
        <span
          className="absolute top-4 left-4 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] pointer-events-none"
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(4px)",
            color: "rgba(196, 133, 92, 0.95)",
            border: "1px solid rgba(196, 133, 92, 0.3)",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
