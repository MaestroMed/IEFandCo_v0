import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { realisations, getRealisationBySlug } from "@/data/realisations";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { getRealisationPhoto } from "@/lib/photoMap";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return realisations.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getRealisationBySlug(slug);
  if (!r) return {};
  return generatePageMetadata({
    title: r.seoTitle || r.title,
    description: r.seoDescription || r.description,
    path: `/realisations/${r.slug}`,
  });
}

export default async function RealisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getRealisationBySlug(slug);
  if (!r) notFound();

  const photo = getRealisationPhoto(r.slug, r.category);

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Réalisations", url: "/realisations" },
    { name: r.title, url: `/realisations/${r.slug}` },
  ]);

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.title,
    description: r.description,
    datePublished: `${r.year}-01-01`,
    author: { "@type": "Organization", name: "IEF & CO" },
    publisher: {
      "@type": "Organization",
      name: "IEF & CO",
      logo: { "@type": "ImageObject", url: "https://iefandco.com/logo.png" },
    },
    about: {
      "@type": "Service",
      serviceType: r.category,
    },
  };

  // Other realisations for "suivant / précédent"
  const currentIdx = realisations.findIndex((x) => x.slug === r.slug);
  const prev = currentIdx > 0 ? realisations[currentIdx - 1] : null;
  const next = currentIdx < realisations.length - 1 ? realisations[currentIdx + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, articleSchema]) }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-0 md:pt-40">
        <div className="forge-gradient-dark" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/realisations" className="hover:opacity-80">Réalisations</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>{r.title}</span>
          </nav>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-6 flex-wrap font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="rounded-full px-3 py-1" style={{ background: "rgba(196, 133, 92, 0.15)", border: "1px solid rgba(196, 133, 92, 0.3)", color: "var(--color-copper)" }}>
              {r.category}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{r.year}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span style={{ color: "var(--text-muted)" }}>{r.location}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span style={{ color: "var(--text-muted)" }}>{r.client}</span>
          </div>

          <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.05]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {r.title}
          </h1>

          {r.tagline && (
            <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed italic font-display" style={{ color: "var(--text-secondary)", textWrap: "balance" } as React.CSSProperties}>
              {r.tagline}
            </p>
          )}
        </div>

        {/* Big photo — hangs over into next section */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 mt-12 -mb-32 md:-mb-40">
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              border: "1px solid var(--border-strong)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            <Photo
              src={photo}
              alt={r.title}
              aspect="aspect-[16/9]"
              treatment="default"
              brackets
              caption={`${r.year} · ${r.category}`}
              priority
              hoverZoom={false}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ KPI STRIP ═══════════ */}
      {r.kpis && r.kpis.length > 0 && (
        <section className="section-forge-light relative overflow-hidden pt-48 pb-16 md:pt-56">
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {r.kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--card-shadow)",
                  }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--color-copper)" }}>
                    {kpi.label}
                  </div>
                  <div className="font-display text-3xl font-bold md:text-4xl" style={{ color: "var(--text)" }}>
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CHALLENGE / SOLUTION / RESULT ═══════════ */}
      {(r.challenge || r.solution || r.result) && (
        <section className="section-forge-light relative overflow-hidden pb-24 md:pb-32">
          <div className="forge-gradient-light" style={{ opacity: 0.3 }} />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <div className="space-y-16">
              {r.challenge && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] rounded px-2 py-1" style={{ background: "rgba(225, 16, 33, 0.1)", color: "var(--color-primary)", border: "1px solid rgba(225, 16, 33, 0.2)" }}>
                      01 · Contexte
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-5 leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                    Le défi
                  </h2>
                  <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                    {r.challenge}
                  </p>
                </div>
              )}

              {r.solution && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] rounded px-2 py-1" style={{ background: "rgba(196, 133, 92, 0.1)", color: "var(--color-copper)", border: "1px solid rgba(196, 133, 92, 0.25)" }}>
                      02 · Notre réponse
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-5 leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                    Notre <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>solution</span>
                  </h2>
                  <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                    {r.solution}
                  </p>
                </div>
              )}

              {r.result && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] rounded px-2 py-1" style={{ background: "rgba(34, 197, 94, 0.08)", color: "rgb(22, 163, 74)", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                      03 · Résultat
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-5 leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                    Le résultat
                  </h2>
                  <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
                    {r.result}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ PHASES TIMELINE ═══════════ */}
      {r.phases && r.phases.length > 0 && (
        <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
          <div className="forge-gradient-dark" />
          <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Phases du projet
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                Chronologie <span className="text-gradient-metal">d&apos;exécution</span>
              </h2>
            </div>

            <ol className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-4 bottom-4 w-px" style={{ background: "rgba(196, 133, 92, 0.2)" }} />

              {r.phases.map((phase, i) => (
                <li key={i} className="relative pl-16 pb-10 last:pb-0">
                  <div
                    className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold"
                    style={{
                      background: "var(--bg-surface)",
                      border: "2px solid var(--color-copper)",
                      color: "var(--color-copper)",
                      boxShadow: "0 0 0 4px var(--bg)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>
                      {phase.title}
                    </h3>
                    {phase.duration && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] rounded-full px-2.5 py-1" style={{ background: "rgba(196, 133, 92, 0.1)", border: "1px solid rgba(196, 133, 92, 0.25)", color: "var(--color-copper)" }}>
                        {phase.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {phase.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ═══════════ SPECS TECHNIQUES + NORMES ═══════════ */}
      {(r.specs || r.standards) && (
        <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {r.specs && r.specs.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                      Spécifications techniques
                    </span>
                  </div>
                  <dl className="space-y-2">
                    {r.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-4 pb-3"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] pt-1" style={{ color: "var(--text-muted)" }}>
                          {spec.label}
                        </dt>
                        <dd className="text-right font-medium text-sm md:text-base" style={{ color: "var(--text)" }}>
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {r.standards && r.standards.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                      Normes & certifications appliquées
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.standards.map((std, i) => (
                      <span
                        key={i}
                        className="rounded-full px-4 py-2 text-sm font-medium font-mono"
                        style={{
                          background: "rgba(196, 133, 92, 0.08)",
                          border: "1px solid rgba(196, 133, 92, 0.25)",
                          color: "var(--text)",
                        }}
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ TESTIMONIAL (WARM) ═══════════ */}
      {r.testimonial && (
        <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
          <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <div
              className="font-display text-[120px] leading-none mb-4 pointer-events-none"
              style={{ color: "rgba(140, 90, 58, 0.15)" }}
              aria-hidden
            >
              &ldquo;
            </div>
            <blockquote
              className="-mt-16 font-display text-2xl md:text-3xl leading-[1.4] font-medium"
              style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}
            >
              {r.testimonial.quote}
            </blockquote>
            <div className="mt-10">
              <div className="font-display font-semibold" style={{ color: "var(--text)" }}>
                {r.testimonial.author}
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-muted)" }}>
                {r.testimonial.role}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ PREV / NEXT NAV ═══════════ */}
      <section className="section-forge-light relative overflow-hidden py-16" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {prev ? (
              <Link
                href={`/realisations/${prev.slug}`}
                className="group rounded-2xl p-6 flex items-start gap-4 transition-all hover:-translate-y-1"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
              >
                <svg className="h-5 w-5 mt-1 shrink-0 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--text-muted)" }}>
                    Projet précédent
                  </div>
                  <div className="font-display text-base font-bold leading-tight" style={{ color: "var(--text)" }}>
                    {prev.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/realisations/${next.slug}`}
                className="group rounded-2xl p-6 flex items-start justify-end gap-4 text-right transition-all hover:-translate-y-1"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
              >
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--text-muted)" }}>
                    Projet suivant
                  </div>
                  <div className="font-display text-base font-bold leading-tight" style={{ color: "var(--text)" }}>
                    {next.title}
                  </div>
                </div>
                <svg className="h-5 w-5 mt-1 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre projet <br />
            <span className="text-gradient-metal">sera le prochain</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Chaque case study de ce portfolio a commencé par un appel.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/devis" size="lg">Demander un devis</Button>
            <Button href="/realisations" variant="secondary" size="lg">Voir toutes les réalisations</Button>
          </div>
        </div>
      </section>
    </>
  );
}
