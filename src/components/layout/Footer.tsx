import Link from "next/link";
import { companyInfo } from "@/data/navigation";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "#050508",
        color: "#F5F5F2",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Top accent bar — copper gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196, 133, 92, 0.6), transparent)" }}
      />

      {/* Subtle living gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 100%, rgba(196, 133, 92, 0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 0%, rgba(196, 133, 92, 0.05) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-10">
        {/* Big brand row */}
        <div className="mb-16 grid items-end gap-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block group">
              <span
                className="font-display text-5xl font-bold tracking-tight md:text-7xl leading-[0.9]"
                style={{ color: "#F5F5F2" }}
              >
                IEF<span className="text-primary">&</span>CO
              </span>
            </Link>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: "rgba(245, 245, 242, 0.65)" }}>
              Concepteur et fabricant de solutions métalliques sur mesure.
              De la conception à la pose, par votre métallier d&apos;Île-de-France.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all hover:scale-105"
              style={{
                background: "var(--color-primary)",
                color: "#FFFFFF",
                boxShadow: "0 10px 30px rgba(225, 16, 33, 0.25)",
              }}
            >
              Demander un devis
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
              style={{ color: "rgba(245, 245, 242, 0.65)" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="font-mono text-sm">{companyInfo.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3
              className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--color-copper)" }}
            >
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(245, 245, 242, 0.6)" }}
                  >
                    <span className="h-px w-0 transition-all group-hover:w-3" style={{ background: "var(--color-copper)" }} />
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--color-copper)" }}
            >
              Maintenance
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/maintenance/contrats", label: "Contrats Bronze / Argent / Or" },
                { href: "/depannage", label: "Dépannage urgent" },
                { href: "/maintenance/hormann", label: "Maintenance Hörmann" },
                { href: "/maintenance/crawford", label: "Maintenance Crawford" },
                { href: "/maintenance/maviflex", label: "Maintenance Maviflex" },
                { href: "/maintenance/came", label: "Maintenance Came" },
                { href: "/zones-intervention", label: "Zones d'intervention IDF" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(245, 245, 242, 0.6)" }}
                  >
                    <span className="h-px w-0 transition-all group-hover:w-3" style={{ background: "var(--color-copper)" }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3
              className="font-mono text-[11px] uppercase tracking-[0.3em] mt-8 mb-5"
              style={{ color: "var(--color-copper)" }}
            >
              Ressources
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/comparatifs", label: "Comparatifs" },
                { href: "/glossaire", label: "Glossaire technique" },
                { href: "/blog", label: "Blog & guides" },
                { href: "/realisations", label: "Réalisations" },
                { href: "/assisteo", label: "ASSISTEO" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(245, 245, 242, 0.6)" }}
                  >
                    <span className="h-px w-0 transition-all group-hover:w-3" style={{ background: "var(--color-copper)" }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--color-copper)" }}
            >
              Atelier
            </h3>
            <address className="not-italic space-y-3 text-sm" style={{ color: "rgba(245, 245, 242, 0.6)" }}>
              <p>
                {companyInfo.address.street}<br />
                {companyInfo.address.postalCode} {companyInfo.address.city}<br />
                <span style={{ color: "rgba(245, 245, 242, 0.4)" }}>{companyInfo.address.region}</span>
              </p>
              <p>
                <a href={`mailto:${companyInfo.email}`} className="transition-colors hover:text-white break-all">
                  {companyInfo.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h3
              className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
              style={{ color: "var(--color-copper)" }}
            >
              Certifications
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(245, 245, 242, 0.6)" }}>
              <li className="font-mono">— EN 1090 · EXC2</li>
              <li className="font-mono">— Eurocode 3</li>
              <li className="font-mono">— EN 13241</li>
              <li className="font-mono">— EN 16034</li>
            </ul>
            <div className="mt-6">
              <a
                href={companyInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-110"
                style={{
                  background: "rgba(196, 133, 92, 0.08)",
                  border: "1px solid rgba(196, 133, 92, 0.2)",
                  color: "var(--color-copper)",
                }}
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(245, 245, 242, 0.4)" }}>
            <span>© {new Date().getFullYear()} IEF & CO</span>
            <span style={{ color: "rgba(245, 245, 242, 0.2)" }}>·</span>
            <span>SIREN {companyInfo.siren}</span>
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(245, 245, 242, 0.4)" }}>
            <Link href="/mentions-legales" className="transition-colors hover:text-white">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="transition-colors hover:text-white">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
