import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparatifs, getComparatorBySlug } from "@/data/comparatifs";
import { Button } from "@/components/ui/Button";
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
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/comparatifs" className="hover:opacity-80">Comparatifs</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>{comp.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              Comparatif technique
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            <span className="text-gradient-metal">{comp.optionAName}</span>
            <span className="block text-3xl md:text-4xl mt-2" style={{ color: "var(--text-muted)" }}>vs</span>
            <span style={{ color: "var(--text)" }}>{comp.optionBName}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {comp.tagline}
          </p>
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
                          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-copper)" }}>
                            <path d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        <span style={row.winner === "A" ? { fontWeight: 600, color: "var(--text)" } : {}}>{row.optionA}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <div className="flex items-start gap-2">
                        {row.winner === "B" && (
                          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-primary)" }}>
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
            <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text)" }}
               dangerouslySetInnerHTML={{ __html: comp.verdict.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-primary)">$1</strong>') }}
            />
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
                  <svg className="h-5 w-5 transition-transform group-open:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-copper)" }}>
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
