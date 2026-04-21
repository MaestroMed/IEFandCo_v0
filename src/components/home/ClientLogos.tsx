"use client";

import type { Client } from "@/data/clients";
import { ClientLogoBadge } from "@/components/ui/ClientLogoBadge";

function LogoRow({ clients, reverse = false }: { clients: Client[]; reverse?: boolean }) {
  const tripled = [...clients, ...clients, ...clients];
  return (
    <div className="relative overflow-hidden py-3">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-40" style={{ background: "linear-gradient(to right, var(--bg), transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-40" style={{ background: "linear-gradient(to left, var(--bg), transparent)" }} />
      <div className="flex items-center gap-8" style={{ width: "max-content", animation: `${reverse ? "marquee-reverse" : "marquee"} ${clients.length * 4.5}s linear infinite` }}>
        {tripled.map((client, i) => (
          <ClientLogoBadge key={`${client.name}-${i}`} name={client.name} variant="minimal" />
        ))}
      </div>
    </div>
  );
}

export function ClientLogos({ clients }: { clients: Client[] }) {
  return (
    <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
      <div className="forge-gradient-light" style={{ opacity: 0.35 }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
            Références
          </span>
          <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
          Ils nous font confiance
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
          Des grands comptes aux PME, nos clients nous choisissent pour notre fiabilité,
          notre technicité et notre engagement sur les délais.
        </p>
      </div>
      <div className="relative z-10 mt-16 space-y-4">
        <LogoRow clients={clients} />
        <LogoRow clients={clients} reverse />
      </div>
      {/* Bottom accent */}
      <div className="relative z-10 mt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
          <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          <span>+ de 180 clients actifs</span>
          <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
        </div>
      </div>
    </section>
  );
}
