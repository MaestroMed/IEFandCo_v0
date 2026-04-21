type Status = "draft" | "published" | "archived" | "scheduled" | string;

const COLORS: Record<string, { bg: string; fg: string; label?: string }> = {
  published: { bg: "rgba(34,197,94,0.15)", fg: "rgb(34,197,94)", label: "Publie" },
  draft: { bg: "rgba(234,140,56,0.15)", fg: "rgb(234,140,56)", label: "Brouillon" },
  archived: { bg: "rgba(130,130,130,0.15)", fg: "rgb(130,130,130)", label: "Archive" },
  scheduled: { bg: "rgba(99,102,241,0.15)", fg: "rgb(99,102,241)", label: "Programme" },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = COLORS[status] ?? { bg: "rgba(130,130,130,0.15)", fg: "rgb(130,130,130)" };
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
      style={{ background: c.bg, color: c.fg }}
    >
      {c.label ?? status}
    </span>
  );
}
