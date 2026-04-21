"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

/**
 * Button — polished primary/secondary/ghost with:
 *  - smooth scale on press
 *  - subtle lift on hover (primary)
 *  - metal-shine sweep overlay on primary hover
 *  - arrow icon in children that translates on hover (auto)
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-display font-semibold rounded-xl overflow-hidden group active:scale-[0.96] will-change-transform";
  const transition = "transition-[transform,box-shadow,background-color,border-color,color] duration-[var(--dur-md)] ease-[var(--ease-out-quart)]";

  const variants = {
    primary:
      "bg-primary text-white shadow-[0_6px_20px_rgba(225,16,33,0.25)] hover:shadow-[0_10px_36px_rgba(225,16,33,0.4)] hover:-translate-y-0.5",
    secondary:
      "bg-[var(--bg-surface)] text-[var(--text)] hover:bg-[var(--bg-muted)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
    ghost:
      "text-[var(--text-secondary)] hover:text-[var(--text)] bg-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2.5",
  };

  const classes = cn(base, transition, variants[variant], sizes[size], className);

  const borderStyle =
    variant === "secondary"
      ? { border: "1px solid var(--border-strong)" }
      : {};

  // Metal-shine sweep (primary only)
  const shine =
    variant === "primary" ? (
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 52%, transparent 60%)",
          backgroundSize: "220% 100%",
          animation: "metal-shine 1.8s ease-in-out infinite",
        }}
      />
    ) : null;

  // Subtle inner highlight on primary — pressed-button feel
  const innerHighlight =
    variant === "primary" ? (
      <span
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    ) : null;

  const content = (
    <>
      {innerHighlight}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">
        {children}
      </span>
      {shine}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={borderStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && "opacity-50 cursor-not-allowed")}
      style={borderStyle}
    >
      {content}
    </button>
  );
}
