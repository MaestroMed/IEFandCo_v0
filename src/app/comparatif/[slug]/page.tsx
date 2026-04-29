import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparatifs, getComparatorBySlug } from "@/data/comparatifs";
import { Button } from "@/components/ui/Button";
import { ProjectIllustration } from "@/components/ui/ProjectIllustration";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return comparatifs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparatorBySlug(slug);
  if (!c) return {};
  return generatePageMetadata({
    title: c.seo.title,
    description: c.seo.description,
    path: `/comparatif/${c.slug}`,
  });
}

export default async function ComparatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getComparatorBySlug(slug);
  if (!comp) notFound();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Comparatifs", url: "/comparatifs" },
    { name: comp.title, url: `/comparatif/${comp.slug}` },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comp.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  // Count winners
  const aWins = comp.rows.filter((r) => r.winner === "A").length;
  const bWins = comp.rows.filter((r) => r.winner === "B").length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, faqSchema]) }} />

      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.5} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 80% 40%, rgba(${comp.accent}, 0.18) 0%, transparent 60%)`,
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/comparatifs" className="hover:opacity-80">Comparatifs</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: `rgb(${comp.accent})` }}>{comp.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10" style={{ background: `rgb(${comp.accent})` }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${comp.accent})` }}>
                  Comparatif technique · {comp.rows.length} critères
                </span>
              </div>
              <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                <span className="text-gradient-metal">{comp.optionAName}</span>
                <span className="block text-2xl md:text-3xl my-3 font-mono font-normal uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>— vs —</span>
                <span style={{ color: "var(--text)" }}>{comp.optionBName}</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
                {comp.tagline}
              </p>
            </div>

            {/* Blueprint illustration — tinted with comparator accent */}
            <div className="relative hidden lg:block">
              <div
                className="absolute -inset-6 pointer-events-none -z-10"
                style={{
                  background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${comp.accent}, 0.25) 0%, transparent 70%)`,
                }}
              />
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(${comp.accent}, 0.18)`,
                }}
              >
                <ProjectIllustration
                  category={comp.category}
                  accentColor={comp.accent}
                  hideTitle
                />
                {/* Corner brackets */}
                <svg className="absolute top-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 8V2h6" stroke={`rgb(${comp.accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute top-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 2h6v6" stroke={`rgb(${comp.accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 left-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 12v6h6" stroke={`rgb(${comp.accent})`} strokeWidth="1.4" /></svg>
                <svg className="absolute bottom-3 right-3 h-5 w-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M18 12v6h-6" stroke={`rgb(${comp.accent})`} strokeWidth="1.4" /></svg>
                {/* Title block */}
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] pointer-events-none z-10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: `rgb(${comp.accent})` }}>CMP · {comp.slug.toUpperCase().slice(0, 18)}</span>
                  <span>ECH · 1:100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCORE STRIP */}
      <section className="border-y" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-muted)" }}>{comp.optionAName}</div>
              <div className="font-display text-4xl font-bold" style={{ color: "var(--color-copper)" }}>
                {aWins}<span className="text-lg" style={{ color: "var(--text-muted)" }}> / {comp.rows.length}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Critères gagnés</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-muted)" }}>{comp.optionBName}</div>
              <div className="font-display text-4xl font-bold" style={{ color: "var(--color-primary)" }}>
                {bWins}<span className="text-lg" style={{ color: "var(--text-muted)" }}> / {comp.rows.length}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Critères gagnés</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-24">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
            {comp.intro}
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section-forge-light relative overflow-hidden pb-24 md:pb-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-10" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Tableau comparatif détaillé
          </h2>
          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--bg-muted)" }}>
                  <th className="text-left p-4 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Critère</th>
                  <th className="text-left p-4 font-display font-bold" style={{ color: "var(--color-copper)" }}>{comp.optionAName}</th>
                  <th className="text-left p-4 font-display font-bold" style={{ color: "var(--color-primary)" }}>{comp.optionBName}</th>
                </tr>
              </thead>
              <tbody>
                {comp.rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "var(--card-bg)" : "transparent" }}>
                    <td className="p-4 font-medium text-sm md:text-base" style={{ color: "var(--text)" }}>{row.criterion}</td>
                    <td className="p-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <div className="flex items-start gap-2">
                        {row.winner === "A" && (
                          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }} role="img" aria-label="Avantage">
                            <path d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        <span style={row.winner === "A" ? { fontWeight: 600, color: "var(--text)" } : {}}>{row.optionA}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <div className="flex items-start gap-2">
                        {row.winner === "B" && (
                          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-primary)" }} role="img" aria-label="Avantage">
                            <path d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        <span style={row.winner === "B" ? { fontWeight: 600, color: "var(--text)" } : {}}>{row.optionB}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Cas d&apos;usage typiques
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Quelle option pour <span className="text-gradient-metal">votre situation ?</span>
            </h2>
          </div>
          <div className="space-y-3">
            {comp.useCases.map((uc, i) => (
              <div key={i} className="glass-card flex items-start gap-5 rounded-2xl p-6">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display font-bold text-lg"
                  style={{
                    background: uc.recommendation === "A" ? "rgba(196, 133, 92, 0.15)" : "rgba(225, 16, 33, 0.15)",
                    color: uc.recommendation === "A" ? "var(--color-copper)" : "var(--color-primary)",
                    border: `1px solid ${uc.recommendation === "A" ? "rgba(196, 133, 92, 0.3)" : "rgba(225, 16, 33, 0.3)"}`,
                  }}
                >
                  {uc.recommendation}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-semibold mb-1" style={{ color: "var(--text)" }}>
                    {uc.scenario}
                  </div>
                  <div className="text-sm flex items-center gap-2 mb-2 font-mono uppercase tracking-[0.18em]" style={{ color: uc.recommendation === "A" ? "var(--color-copper)" : "var(--color-primary)" }}>
                    → {uc.recommendation === "A" ? comp.optionAName : comp.optionBName}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {uc.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERDICT */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" style={{ opacity: 0.6 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Verdict expert
              </span>
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Notre <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>recommandation</span>
            </h2>
          </div>
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow-hover)",
            }}
          >
            <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text)" }}>
              {comp.verdict.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={i} style={{ color: "var(--color-primary)" }}>{part.slice(2, -2)}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                FAQ
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--text)" }}>
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {comp.faq.map((q, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 list-none">
                  <span className="font-display text-base font-semibold md:text-lg pr-4" style={{ color: "var(--text)" }}>
                    {q.question}
                  </span>
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }} aria-hidden="true">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pl-4 border-l-2 ml-6" style={{ borderColor: "rgba(196, 133, 92, 0.3)" }}>
                  <p className="text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                    {q.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER COMPARATIFS */}
      {comparatifs.filter((c) => c.slug !== slug).length > 0 && (
        <section className="section-forge-light relative overflow-hidden py-20 md:py-24" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <div className="mb-10 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Autres comparatifs techniques
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {comparatifs
                .filter((c) => c.slug !== slug)
                .slice(0, 3)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/comparatif/${other.slug}`}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(${other.accent}, 0.12) 0%, transparent 70%)`,
                      }}
                    />
                    <div className="relative flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: `rgb(${other.accent})` }}>
                      <span className="h-px w-4" style={{ background: `rgb(${other.accent})` }} />
                      <span>Comparatif</span>
                    </div>
                    <h3 className="relative font-display text-base font-bold leading-tight mb-2" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                      {other.title}
                    </h3>
                    <p className="relative text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {other.tagline}
                    </p>
                    <div className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: `rgb(${other.accent})` }}>
                      <span>Lire</span>
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-forge-dark relative overflow-hidden py-20 md:py-28">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Toujours hésitant ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Notre bureau d&apos;étude vous conseille gratuitement la solution adaptée à votre site.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button href="/devis" size="lg">Demander un devis</Button>
            <Button href="/contact" variant="secondary" size="lg">Parler à un expert</Button>
          </div>
        </div>
      </section>
    </>
  );
}
