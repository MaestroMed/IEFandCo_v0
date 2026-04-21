import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="relative rounded-xl p-12 text-center" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
      <span className="pointer-events-none absolute right-2 top-2 h-2 w-2" style={{ borderTop: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />
      <span className="pointer-events-none absolute bottom-2 left-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderLeft: "1px solid var(--color-copper)" }} />
      <span className="pointer-events-none absolute bottom-2 right-2 h-2 w-2" style={{ borderBottom: "1px solid var(--color-copper)", borderRight: "1px solid var(--color-copper)" }} />

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--bg-muted)" }}>
        <Icon className="h-6 w-6" style={{ color: "var(--color-copper)" }} />
      </div>
      <h3 className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h3>
      {description && (
        <p className="mt-2 text-sm mx-auto max-w-md" style={{ color: "var(--text-muted)" }}>{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
