import type { Metadata } from "next";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { companyInfo } from "@/data/navigation";
import { ContactForm } from "@/components/forms/ContactForm";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact | Parlons de votre projet métallique",
  description:
    "Contactez IEF & CO pour vos projets de métallerie en Île-de-France. Devis gratuit, étude technique, intervention rapide. Tel : 01 34 05 87 03.",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-16 md:pt-40">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Contact
            </span>
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Parlons de <span className="text-gradient-metal">votre projet</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Étude gratuite, devis détaillé sous 48h, un seul interlocuteur de la conception à la pose.
            Chaque projet commence par une conversation.
          </p>
        </div>
      </section>

      {/* ═══════════ SPLIT : FORM (WARM) + INFO (DARK) ═══════════ */}
      <div className="grid lg:grid-cols-5 min-h-screen">
        {/* LEFT — warm form */}
        <section className="section-forge-warm relative overflow-hidden py-20 md:py-24 lg:col-span-3">
          <div className="forge-gradient-warm" style={{ opacity: 0.7 }} />
          <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

          <div className="relative z-10 mx-auto max-w-2xl w-full px-6 lg:px-12">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Formulaire
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)" }}>
                Décrivez votre projet
              </h2>
              <p className="mt-3 text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
                Réponse sous 24h ouvrées · Étude sans engagement
              </p>
            </div>

            <ContactForm />
          </div>
        </section>

        {/* RIGHT — dark info + map */}
        <aside className="section-forge-dark relative overflow-hidden py-20 md:py-24 lg:col-span-2">
          <div className="forge-gradient-dark" />
          <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

          <div className="relative z-10 mx-auto max-w-md w-full px-6 lg:px-10 space-y-10">
            {/* Address */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Adresse atelier
              </h3>
              <div className="mt-3 flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(196, 133, 92, 0.12)",
                    border: "1px solid rgba(196, 133, 92, 0.25)",
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {companyInfo.address.street}<br />
                  {companyInfo.address.postalCode} {companyInfo.address.city}<br />
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{companyInfo.address.region}</span>
                </p>
              </div>
            </div>

            <div className="h-px" style={{ background: "var(--border)" }} />

            {/* Phone */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Téléphone
              </h3>
              <a
                href={`tel:${companyInfo.phone}`}
                className="mt-3 flex items-start gap-4 group"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all group-hover:scale-110"
                  style={{
                    background: "rgba(196, 133, 92, 0.12)",
                    border: "1px solid rgba(196, 133, 92, 0.25)",
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-xl font-bold transition-colors group-hover:text-primary" style={{ color: "var(--text)" }}>
                    {companyInfo.phoneDisplay}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Lun-Ven · 8h-18h</div>
                </div>
              </a>
            </div>

            <div className="h-px" style={{ background: "var(--border)" }} />

            {/* Email */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Email
              </h3>
              <a
                href={`mailto:${companyInfo.email}`}
                className="mt-3 flex items-start gap-4 group"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all group-hover:scale-110"
                  style={{
                    background: "rgba(196, 133, 92, 0.12)",
                    border: "1px solid rgba(196, 133, 92, 0.25)",
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-base font-semibold transition-colors group-hover:text-primary break-all" style={{ color: "var(--text)" }}>
                    {companyInfo.email}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Réponse sous 24h</div>
                </div>
              </a>
            </div>

            {/* Map */}
            <div
              className="aspect-[4/3] overflow-hidden rounded-xl"
              style={{
                border: "1px solid var(--border-strong)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2620.0!2d2.3446!3d49.0083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6654e85edff4f%3A0x40b82c3688c8930!2s8%20Rue%20Ren%C3%A9%20Dubos%2C%2095410%20Groslay!5e0!3m2!1sfr!2sfr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.5) contrast(1.15) brightness(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation IEF & CO — 8 Rue Rene Dubos, Groslay"
              />
            </div>

            {/* Opening hours */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(196, 133, 92, 0.06)",
                border: "1px solid rgba(196, 133, 92, 0.18)",
              }}
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Horaires atelier
              </h3>
              <dl className="mt-3 space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <div className="flex justify-between"><dt>Lundi – Vendredi</dt><dd>8h00 – 18h00</dd></div>
                <div className="flex justify-between"><dt>Samedi</dt><dd>Sur RDV</dd></div>
                <div className="flex justify-between"><dt>Dépannage</dt><dd style={{ color: "var(--color-copper)" }}>24/7 contrat</dd></div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
