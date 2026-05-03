import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getServices,
  getServiceBySlug,
  getRelatedServices,
  getStaticServiceSlugs,
} from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { Media } from "@/components/ui/Media";
import { getServicePhoto } from "@/lib/photoMap";
import { FAQAccordion } from "./FAQAccordion";
import {
  generatePageMetadata,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo";

export function generateStaticParams() {
  return getStaticServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return generatePageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, related, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getRelatedServices(slug),
    getServices(),
  ]);
  if (!service) notFound();

  const serviceSchema = generateServiceSchema({
    title: service.title,
    description: service.fullDescription,
    slug: service.slug,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.shortTitle, url: `/services/${service.slug}` },
  ]);
  const faqSchema = generateFAQSchema(service.faq);

  const accent = service.accentColor; // "R, G, B"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbSchema, faqSchema]),
        }}
      />

      {/* ═══════════════ HERO (DARK, tinted by service color) ═══════════════ */}
      <section className="section-forge-dark relative flex min-h-[70vh] items-end overflow-hidden pt-32 pb-16">
        {/* Branded service photo — fills the right two-thirds, fades into
           the dark on the left so the title copy stays legible. */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={getServicePhoto(service.slug)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: "center 45%",
              opacity: 1,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, 0.7) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)",
            }}
          />
        </div>

        {/* Service-specific color wash (kept on top of the photo) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at var(--gx) var(--gy), rgba(${accent}, 0.18) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at var(--gx2) var(--gy2), rgba(${accent}, 0.10) 0%, transparent 55%)`,
            animation: "gradient-breathe 22s ease-in-out infinite, gradient-breathe-alt 28s ease-in-out infinite",
          }}
        />
        {/* Blueprint grid */}
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.04 }} />
        {/* Grain */}
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative mx-auto max-w-7xl px-6 w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-end">
            <div>
              {/* Breadcrumb */}
              <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                <Link href="/" className="transition-colors hover:opacity-80">Accueil</Link>
                <span style={{ color: "var(--border-strong)" }}>/</span>
                <Link href="/services" className="transition-colors hover:opacity-80">Services</Link>
                <span style={{ color: "var(--border-strong)" }}>/</span>
                <span style={{ color: `rgb(${accent})` }}>{service.shortTitle}</span>
              </nav>

              {/* Service index */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10" style={{ background: `rgb(${accent})` }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${accent})` }}>
                  Service · {allServices.findIndex((s) => s.slug === slug) + 1} / {allServices.length}
                </span>
              </div>

              <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
                {service.fullDescription}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/devis">Demander un devis</Button>
                <Button href="/contact" variant="secondary">Parler à un expert</Button>
              </div>
            </div>

            {/* Hand-drawn blueprint illustration (per-service accent) */}
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
                {service.coverUrl ? (
                  <div className="aspect-[4/3] relative">
                    <Media
                      url={service.coverUrl}
                      mime={service.coverMime}
                      alt={service.coverAlt || service.title}
                      fill
                      autoPlay
                      muted
                      loop
                      sizes="(max-width: 1024px) 100vw, 600px"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <ProjectIllustration
                    category={service.slug}
                    accentColor={accent}
                    hideTitle
                  />
                )}

                {/* Corner brackets — service-color tint */}
                <svg className="absolute top-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 8V2h6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute top-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 2h6v6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 12v6h6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18 12v6h-6" stroke={`rgb(${accent})`} strokeWidth="1.4" /></svg>

                {/* Title block */}
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] pointer-events-none z-10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: `rgb(${accent})` }}>SVC · {service.slug.toUpperCase()}</span>
                  <span>ECH · 1:100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SUB-SERVICES (LIGHT) ═══════════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: `rgb(${accent})` }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${accent})` }}>
                Nos prestations
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              {service.subServices.length} solutions en {service.shortTitle.toLowerCase()}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.subServices.map((sub, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-mono font-bold"
                    style={{
                      background: `linear-gradient(135deg, rgba(${accent}, 0.18) 0%, rgba(${accent}, 0.06) 100%)`,
                      color: `rgb(${accent})`,
                      border: `1px solid rgba(${accent}, 0.25)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {sub.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {sub.description}
                </p>
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, rgb(${accent}), var(--color-copper))` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER (DARK, service-tinted) ═══════════════ */}
      <section className="section-forge-dark relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 50%, rgba(${accent}, 0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 45% at var(--gx) var(--gy), rgba(196, 133, 92, 0.12) 0%, transparent 55%)`,
            animation: "gradient-breathe 20s ease-in-out infinite",
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Un projet en <span style={{ color: `rgb(${accent})` }}>{service.shortTitle.toLowerCase()}</span> ?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Étude gratuite, devis détaillé, un seul interlocuteur de la conception à la pose.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/devis">Demander un devis</Button>
            <Button href="/contact" variant="secondary">Nous contacter</Button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ (LIGHT) ═══════════════ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Questions fréquentes
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Tout savoir sur nos services en {service.shortTitle.toLowerCase()}
            </h2>
          </div>
          <FAQAccordion items={service.faq} />
        </div>
      </section>

      {/* ═══════════════ RELATED (WARM) ═══════════════ */}
      {related.length > 0 && (
        <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
          <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-14 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Services connexes
                </span>
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)" }}>
                Explorez <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>nos autres expertises</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => {
                const relAccent = rel.accentColor;
                return (
                  <Link
                    key={rel.slug}
                    href={`/services/${rel.slug}`}
                    className="group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    {/* Hover accent wash using the target service's color */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(${relAccent}, 0.12) 0%, transparent 70%)`,
                      }}
                    />

                    <h3 className="relative font-display text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
                      {rel.shortTitle}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {rel.shortDescription}
                    </p>
                    <div className="relative mt-5 inline-flex items-center gap-2 text-sm font-medium" style={{ color: `rgb(${relAccent})` }}>
                      <span>Découvrir</span>
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </div>

                    {/* Bottom accent line in target service color */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, rgb(${relAccent}), var(--color-copper))` }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
