export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-6">
        {/* Forge spinner — copper rings rotating */}
        <div className="relative h-16 w-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--color-copper)",
              borderRightColor: "rgba(196, 133, 92, 0.3)",
              animationDuration: "1.2s",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--color-primary)",
              borderLeftColor: "rgba(225, 16, 33, 0.2)",
              animationDuration: "0.9s",
              animationDirection: "reverse",
            }}
          />
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          <span className="h-px w-6" style={{ background: "var(--color-copper)" }} />
          Chargement
          <span className="h-px w-6" style={{ background: "var(--color-copper)" }} />
        </div>
      </div>
    </div>
  );
}
