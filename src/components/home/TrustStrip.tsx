/**
 * TrustStrip — thin band of B2B credibility signals.
 * Sits between Hero and Services. Always visible above the fold on tablet+.
 */
const trustItems = [
  { value: "EN 1090", suffix: "EXC2", label: "Certification" },
  { value: "500+", suffix: "", label: "Projets livrés" },
  { value: "24h", suffix: "", label: "Délai dépannage" },
  { value: "Étude", suffix: "gratuite", label: "Sans engagement" },
];

export function TrustStrip() {
  return (
    <section
      className="relative overflow-hidden border-y"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 md:gap-4"
            >
              {/* Index ornament */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(196, 133, 92, 0.08)",
                  border: "1px solid rgba(196, 133, 92, 0.2)",
                }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }}>
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-base font-bold leading-tight md:text-lg" style={{ color: "var(--text)" }}>
                  {item.value}
                  {item.suffix && (
                    <span className="ml-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "var(--color-copper)" }}>
                      {item.suffix}
                    </span>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
