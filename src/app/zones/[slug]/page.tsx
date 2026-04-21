import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { zones, getZoneBySlug } from "@/data/zones";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { companyInfo } from "@/data/navigation";
import { getServices } from "@/lib/content";

export function generateStaticParams() {
  return zones.map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const zone = getZoneBySlug(slug);
  if (!zone) return {};
  return generatePageMetadata({
    title: zone.seo.title,
    description: zone.seo.description,
    path: `/zones/${zone.slug}`,
  });
}

export default async function ZonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const zone = getZoneBySlug(slug);
  if (!zone) notFound();

  const services = await getServices();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Zones d'intervention", url: "/zones-intervention" },
    { name: zone.name, url: `/zones/${zone.slug}` },
  ]);

  // LocalBusiness schema with areaServed
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `IEF & CO — Métallerie ${zone.name}`,
    image: "https://iefandco.com/opengraph-image",
    "@id": `https://iefandco.com/zones/${zone.slug}`,
    url: `https://iefandco.com/zones/${zone.slug}`,
    telephone: companyInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      postalCode: companyInfo.address.postalCode,
      addressRegion: zone.region,
      addressCountry: "FR",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${zone.name} (${zone.code})`,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: zone.center.lat,
      longitude: zone.center.lng,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: zone.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, localBusinessSchema, faqSchema]),
        }}
      />

      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/zones-intervention" className="hover:opacity-80">Zones</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>{zone.name} ({zone.code})</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Département {zone.code} · {zone.region}
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Métallerie & maintenance professionnelle <span className="text-gradient-metal">en {zone.name}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {zone.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/devis" size="lg">Demander un devis dans le {zone.code}</Button>
            <Button href="/contact" variant="secondary" size="lg">Nous appeler</Button>
          </div>
        </div>
      </section>

      {/* ═══════════ KPI STRIP ═══════════ */}
      <section
        className="relative overflow-hidden border-y"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {zone.kpis.map((k, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="font-display text-3xl font-bold md:text-4xl" style={{ color: "var(--text)" }}>{k.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>{k.label}</div>
                {k.sub && <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{k.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ INTRO LONG (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
              Présence dans le {zone.code}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98] mb-8" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Métallier expert <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>du {zone.name}</span>
          </h2>
          <div className="prose-lg space-y-6">
            {zone.intro.split("\n\n").map((para, i) => (
              <p key={i} className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                {para}
              </p>
            ))}
          </div>

          {/* Cities served */}
          <div className="mt-12">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--color-copper)" }}>
              Villes & secteurs desservis
            </h3>
            <div className="flex flex-wrap gap-2">
              {zone.cities.map((city, i) => (
                <span
                  key={i}
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  style={{
                    background: "rgba(196, 133, 92, 0.08)",
                    border: "1px solid rgba(196, 133, 92, 0.18)",
                    color: "var(--text)",
                  }}
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Hubs économiques */}
          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--color-copper)" }}>
              Hubs économiques où nous opérons
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {zone.hubs.map((hub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg p-4"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-copper)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{hub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ NOS SERVICES DANS LA ZONE (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Nos services dans le {zone.code}
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              7 expertises au service <br />
              <span className="text-gradient-metal">des entreprises {zone.name === "Paris" ? "parisiennes" : `du ${zone.code}`}</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group glass-card flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--color-copper)" }}>
                  Service {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {s.shortTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {s.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DÉLAIS (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-24">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl p-8" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--color-primary)" }}>
                Urgence sous contrat
              </div>
              <div className="font-display text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {zone.slaUrgence}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Délai d&apos;intervention dépannage urgent pour les clients sous contrat de maintenance dans le {zone.code}.
              </p>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--color-copper)" }}>
                Standard
              </div>
              <div className="font-display text-4xl font-bold mb-2" style={{ color: "var(--text)" }}>
                {zone.slaStandard}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Délai d&apos;intervention pour les demandes hors contrat ou non urgentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TÉMOIGNAGE ZONE (WARM) ═══════════ */}
      {zone.testimonial && (
        <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
          <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <div className="text-center mb-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Témoignage client {zone.name}
              </div>
            </div>
            <blockquote className="text-center font-display text-2xl md:text-3xl leading-[1.4] font-medium" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              &laquo;&nbsp;{zone.testimonial.quote}&nbsp;&raquo;
            </blockquote>
            <div className="mt-8 text-center">
              <div className="font-display font-semibold" style={{ color: "var(--text)" }}>{zone.testimonial.author}</div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-muted)" }}>{zone.testimonial.company}</div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FAQ (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Questions fréquentes — {zone.name}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)" }}>
              Spécificités du {zone.code}
            </h2>
          </div>
          <div className="space-y-3">
            {zone.faq.map((q, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 list-none">
                  <span className="flex items-start gap-4 flex-1 min-w-0 pr-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base font-semibold md:text-lg" style={{ color: "var(--text)" }}>{q.question}</span>
                  </span>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 ml-0 md:ml-9 pl-4 border-l-2" style={{ borderColor: "rgba(196, 133, 92, 0.3)" }}>
                  <p className="text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                    {q.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Un projet métallique <br />
            <span className="text-gradient-metal">dans le {zone.code} ?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Étude gratuite, devis détaillé, intervention dans les délais que nous garantissons.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/devis" size="lg">Demander un devis</Button>
            <Button href="/maintenance/contrats" variant="secondary" size="lg">Voir nos contrats maintenance</Button>
          </div>
        </div>
      </section>
    </>
  );
}
