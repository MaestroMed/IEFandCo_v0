import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { depannageServices, getDepannageService } from "@/data/depannage";
import { zones, getZoneBySlug } from "@/data/zones";
import { Button } from "@/components/ui/Button";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { companyInfo } from "@/data/navigation";

export function generateStaticParams() {
  const params: Array<{ service: string; zone: string }> = [];
  for (const service of depannageServices) {
    for (const zone of zones) {
      params.push({ service: service.slug, zone: zone.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; zone: string }>;
}): Promise<Metadata> {
  const { service, zone } = await params;
  const s = getDepannageService(service);
  const z = getZoneBySlug(zone);
  if (!s || !z) return {};
  return generatePageMetadata({
    title: `Dépannage ${s.label} dans le ${z.code} (${z.name})`,
    description: `Dépannage d'urgence ${s.label.toLowerCase()} dans le ${z.code} sous contrat IEF & CO : intervention sous ${z.slaUrgence}, stock pièces permanent, toutes marques. Devis gratuit.`,
    path: `/depannage/${s.slug}/${z.slug}`,
  });
}

export default async function DepannageComboPage({
  params,
}: {
  params: Promise<{ service: string; zone: string }>;
}) {
  const { service, zone } = await params;
  const s = getDepannageService(service);
  const z = getZoneBySlug(zone);
  if (!s || !z) notFound();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Dépannage", url: "/depannage" },
    { name: s.label, url: `/depannage/${s.slug}` },
    { name: z.name, url: `/depannage/${s.slug}/${z.slug}` },
  ]);

  // LocalBusiness + Service schema combining zone + service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `Dépannage ${s.label}`,
    provider: {
      "@type": "LocalBusiness",
      name: "IEF & CO",
      telephone: companyInfo.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: companyInfo.address.street,
        addressLocality: companyInfo.address.city,
        postalCode: companyInfo.address.postalCode,
        addressCountry: "FR",
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${z.name} (${z.code})`,
    },
    description: s.intro.substring(0, 300),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.commonFailures.slice(0, 4).map((f) => ({
      "@type": "Question",
      name: `${f.title} — Comment réparer ?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${f.symptom}. ${f.fix}. Durée moyenne : ${f.avgDuration}.`,
      },
    })),
  };

  // Determine accent RGB
  const accent = s.accentColor;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, serviceSchema, faqSchema]) }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 40%, rgba(${accent}, 0.20) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 75% 60%, rgba(${accent}, 0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 20% 90%, rgba(225, 16, 33, 0.05) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] flex-wrap" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/depannage" className="hover:opacity-80">Dépannage</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span>{s.label}</span>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: `rgb(${accent})` }}>{z.name} ({z.code})</span>
          </nav>

          {/* Urgence pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 mb-6" style={{ background: "rgba(225, 16, 33, 0.1)", border: "1px solid rgba(225, 16, 33, 0.3)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75" style={{ background: "var(--color-primary)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-primary)" }} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-primary)" }}>
              Intervention urgente · SLA {z.slaUrgence}
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 items-center">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Dépannage <span style={{ color: `rgb(${accent})` }}>{s.label.toLowerCase()}</span><br />
                <span className="text-gradient-metal">dans le {z.code} — {z.name}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
                {s.tagline}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="inline-flex items-center gap-3 rounded-lg px-6 py-3 font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "var(--color-primary)", boxShadow: "0 10px 30px rgba(225, 16, 33, 0.3)" }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Appeler {companyInfo.phoneDisplay}
                </a>
                <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
              </div>
            </div>

            {/* Blueprint illustration on the right — tinted with accent */}
            <div className="relative hidden lg:block">
              <div
                className="absolute -inset-8 pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${accent}, 0.30) 0%, transparent 70%)`,
                }}
              />
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(${accent}, 0.18)`,
                }}
              >
                <ProjectIllustration
                  category={s.relatedServices[0] || "industrielles"}
                  accentColor={accent}
                  hideTitle
                />
                <svg className="absolute top-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 8V2h6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute top-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 2h6v6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 12v6h6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18 12v6h-6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] pointer-events-none z-10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: `rgb(${accent})` }}>URG · {z.code} · {s.slug.toUpperCase()}</span>
                  <span>SLA {z.slaUrgence}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ KPI STRIP ═══════════ */}
      <section className="border-y" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-primary)" }}>Urgence sous contrat</div>
              <div className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>{z.slaUrgence}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>Standard</div>
              <div className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>{z.slaStandard}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>Premier passage</div>
              <div className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>90%</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>Toutes marques</div>
              <div className="mt-1 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>{s.brands.length}+</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INTRO LONG (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: `rgb(${accent})` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${accent})` }}>
              Notre intervention {s.label.toLowerCase()}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98] mb-8" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Expert dépannage {s.label.toLowerCase()} <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>dans le {z.name}</span>
          </h2>
          <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
            {s.intro}
          </p>

          {/* Business impact callout */}
          <div
            className="mt-10 rounded-2xl p-6"
            style={{
              background: "rgba(225, 16, 33, 0.04)",
              border: "1px solid rgba(225, 16, 33, 0.18)",
              borderLeftWidth: "4px",
              borderLeftColor: "var(--color-primary)",
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--color-primary)" }}>
              Coût d&apos;un arrêt
            </div>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text)" }}>
              {s.businessImpact}
            </p>
          </div>

          {/* Brands supported */}
          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: "var(--color-copper)" }}>
              Marques prises en charge
            </h3>
            <div className="flex flex-wrap gap-2">
              {s.brands.map((b, i) => (
                <span
                  key={i}
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  style={{
                    background: "rgba(196, 133, 92, 0.08)",
                    border: "1px solid rgba(196, 133, 92, 0.2)",
                    color: "var(--text)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMMON FAILURES TABLE ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: `rgb(${accent})` }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${accent})` }}>
                Diagnostics les plus fréquents
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              {s.commonFailures.length} pannes que nous <span className="text-gradient-metal">diagnostiquons & réparons</span>
            </h2>
          </div>

          <div className="space-y-3">
            {s.commonFailures.map((f, i) => (
              <details
                key={i}
                className="group glass-card rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 list-none">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold"
                      style={{
                        background: `rgba(${accent}, 0.15)`,
                        color: `rgb(${accent})`,
                        border: `1px solid rgba(${accent}, 0.3)`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base font-bold md:text-lg" style={{ color: "var(--text)" }}>
                        {f.title}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
                        Durée moyenne · {f.avgDuration}
                      </div>
                    </div>
                  </div>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 grid md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg p-4" style={{ background: "rgba(225, 16, 33, 0.05)", border: "1px solid rgba(225, 16, 33, 0.15)" }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--color-primary)" }}>
                      Symptôme
                    </div>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{f.symptom}</p>
                  </div>
                  <div className="rounded-lg p-4" style={{ background: `rgba(${accent}, 0.06)`, border: `1px solid rgba(${accent}, 0.2)` }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: `rgb(${accent})` }}>
                      Notre intervention
                    </div>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{f.fix}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STOCK PIÈCES ═══════════ */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Stock atelier permanent
              </span>
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Les pièces critiques <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>déjà dans nos camions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
              Nos techniciens arrivent avec les pièces les plus courantes — 90% des interventions résolues au premier passage.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {s.partsInStock.map((p, i) => (
              <span
                key={i}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: "rgba(255, 252, 245, 0.85)",
                  border: "1px solid rgba(196, 133, 92, 0.25)",
                  color: "var(--text)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ZONE-SPECIFIC INFO ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                  Notre présence {z.name}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                {z.tagline}
              </h2>
              <p className="mt-5 text-sm md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {z.intro.split("\n\n")[0]}
              </p>
              <Link
                href={`/zones/${z.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--color-copper)" }}
              >
                En savoir plus sur notre présence dans le {z.code}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Villes & secteurs desservis
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {z.cities.slice(0, 8).map((city, i) => (
                  <span
                    key={i}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
              {z.testimonial && (
                <blockquote
                  className="mt-8 rounded-xl p-6"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeftWidth: "4px", borderLeftColor: `rgb(${accent})` }}
                >
                  <p className="text-sm italic leading-relaxed mb-3" style={{ color: "var(--text)" }}>
                    &laquo;&nbsp;{z.testimonial.quote}&nbsp;&raquo;
                  </p>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    {z.testimonial.author} · {z.testimonial.company}
                  </div>
                </blockquote>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 50%, rgba(${accent}, 0.22) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196, 133, 92, 0.12) 0%, transparent 55%)`,
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre <span style={{ color: `rgb(${accent})` }}>{s.label.toLowerCase()}</span> <br />
            <span className="text-gradient-metal">est en panne ?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Appelez-nous maintenant. Diagnostic par téléphone immédiat, envoi du technicien sous {z.slaUrgence} pour les clients sous contrat.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center gap-3 rounded-lg px-8 py-4 font-semibold text-white text-lg transition-all hover:scale-105"
              style={{ background: "var(--color-primary)", boxShadow: "0 20px 60px rgba(225, 16, 33, 0.4)" }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {companyInfo.phoneDisplay}
            </a>
            <Button href="/maintenance/contrats" variant="secondary" size="lg">Voir nos contrats</Button>
          </div>
        </div>
      </section>

      {/* ═══════════ CROSS-LINKS (LIGHT) ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="relative z-10 mx-auto max-w-6xl px-6 space-y-12">
          {/* Same service, other zones */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: `rgb(${accent})` }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${accent})` }}>
                {s.label} dans les autres départements
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {zones
                .filter((otherZ) => otherZ.slug !== z.slug)
                .map((otherZ) => (
                  <Link
                    key={otherZ.slug}
                    href={`/depannage/${s.slug}/${otherZ.slug}`}
                    className="group rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--card-bg)",
                      border: `1px solid rgba(${accent}, 0.15)`,
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: `rgb(${accent})` }}
                      >
                        {otherZ.code}
                      </span>
                      <svg
                        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        style={{ color: `rgb(${accent})` }}
                        aria-hidden="true"
                      >
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <div className="mt-1 font-display text-sm font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {otherZ.name}
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Other services, same zone */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Autres dépannages dans le {z.code}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {depannageServices
                .filter((otherS) => otherS.slug !== s.slug)
                .map((otherS) => (
                  <Link
                    key={otherS.slug}
                    href={`/depannage/${otherS.slug}/${z.slug}`}
                    className="group rounded-xl px-4 py-3 transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--card-bg)",
                      border: `1px solid rgba(${otherS.accentColor}, 0.18)`,
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: `rgb(${otherS.accentColor})` }}
                      >
                        URG
                      </span>
                      <svg
                        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        style={{ color: `rgb(${otherS.accentColor})` }}
                        aria-hidden="true"
                      >
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <div className="font-display text-sm font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {otherS.label}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
