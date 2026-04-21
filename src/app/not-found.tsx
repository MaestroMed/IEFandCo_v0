import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-forge-dark relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Living gradient */}
      <div className="forge-gradient-dark" />
      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
            ERR · 404 · NOT FOUND
          </span>
          <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
        </div>

        <h1 className="font-display font-bold leading-[0.9] tracking-tight" style={{ fontSize: "clamp(6rem, 18vw, 14rem)" }}>
          <span className="text-gradient-metal">404</span>
        </h1>

        <p className="mt-4 font-display text-2xl md:text-3xl" style={{ color: "var(--text)" }}>
          Cet ouvrage n&apos;existe pas
        </p>
        <p className="mx-auto mt-3 max-w-md text-base" style={{ color: "var(--text-secondary)" }}>
          La page que vous cherchez n&apos;a jamais été forgée — ou elle a été déplacée.
          Reprenez à l&apos;accueil ou consultez nos services.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Button href="/" size="lg">Retour à l&apos;accueil</Button>
          <Link
            href="/services"
            className="inline-flex items-center gap-3 rounded-lg px-5 py-3 text-sm font-medium transition-colors"
            style={{
              border: "1px solid var(--border-strong)",
              color: "var(--text)",
            }}
          >
            Voir nos services
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
