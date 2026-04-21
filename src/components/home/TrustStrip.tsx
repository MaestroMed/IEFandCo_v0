/**
 * TrustStrip — thin band of B2B credibility signals.
 * Sits between Hero and Services. Always visible above the fold on tablet+.
 * Each signal has its own icon and subtle accent so the strip reads as
 * four distinct attributes, not a repeated ornament.
 */
const trustItems = [
  {
    value: "EN 1090",
    suffix: "EXC2",
    label: "Certification",
    accent: "196, 133, 92", // copper
    icon: (
      // shield-check
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    value: "500+",
    suffix: "",
    label: "Projets livrés",
    accent: "166, 124, 82", // warm earth
    icon: (
      // document-stack
      <path d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M7.5 3.75v1.5A2.25 2.25 0 005.25 7.5h-1.5M7.5 3.75H18a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 18.75H5.25A2.25 2.25 0 013 16.5v-8.25M9 15l3-3 3 3M9 10.5l3-3 3 3" />
    ),
  },
  {
    value: "24h",
    suffix: "",
    label: "Délai dépannage",
    accent: "225, 16, 33", // primary red — urgency
    icon: (
      // clock
      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    value: "Étude",
    suffix: "gratuite",
    label: "Sans engagement",
    accent: "60, 170, 140", // teal — free / safe
    icon: (
      // pencil-ruler
      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    ),
  },
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
              {/* Accent ornament — per-item color */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform hover:scale-105"
                style={{
                  background: `rgba(${item.accent}, 0.08)`,
                  border: `1px solid rgba(${item.accent}, 0.22)`,
                }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: `rgb(${item.accent})` }}
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-base font-bold leading-tight md:text-lg" style={{ color: "var(--text)" }}>
                  {item.value}
                  {item.suffix && (
                    <span
                      className="ml-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em]"
                      style={{ color: `rgb(${item.accent})` }}
                    >
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
