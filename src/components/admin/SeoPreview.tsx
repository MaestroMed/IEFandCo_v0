interface SeoPreviewProps {
  title: string;
  description: string;
  path: string; // e.g., "/blog/mon-article"
  domain?: string;
}

export function SeoPreview({ title, description, path, domain = "iefandco.fr" }: SeoPreviewProps) {
  const displayTitle = (title || "Titre de l'article").slice(0, 60);
  const displayDescription = (description || "Une courte description de l'article apparaitra ici...").slice(0, 160);

  return (
    <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
        Apercu Google
      </div>
      <div className="space-y-1">
        <div className="text-xs" style={{ color: "#006621" }}>{domain}{path}</div>
        <div className="text-base font-medium" style={{ color: "#1a0dab" }}>{displayTitle}</div>
        <div className="text-xs" style={{ color: "#545454" }}>{displayDescription}</div>
      </div>
      <div className="mt-3 flex gap-4 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
        <span>{displayTitle.length}/60</span>
        <span>{displayDescription.length}/160</span>
      </div>
    </div>
  );
}
