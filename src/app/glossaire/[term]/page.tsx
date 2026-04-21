import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glossary, getTermBySlug } from "@/data/glossary";
import { Button } from "@/components/ui/Button";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return glossary.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const t = getTermBySlug(term);
  if (!t) return {};
  return generatePageMetadata({
    title: `${t.term} — définition métallerie`,
    description: t.shortDef,
    path: `/glossaire/${t.slug}`,
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const t = getTermBySlug(term);
  if (!t) notFound();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Glossaire", url: "/glossaire" },
    { name: t.term, url: `/glossaire/${t.slug}` },
  ]);

  // Schema.org DefinedTerm
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.fullDef,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glossaire métallerie IEF & CO",
      url: "https://iefandco.com/glossaire",
    },
  };

  // Get related terms
  const relatedTerms = (t.related || [])
    .map((slug) => getTermBySlug(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, definedTermSchema]) }} />

      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="forge-gradient-dark" />
        <WorkshopAtmosphere intensity={0.4} origin="bottom" />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/glossaire" className="hover:opacity-80">Glossaire</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>{t.term}</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em]" style={{ background: "rgba(196, 133, 92, 0.15)", border: "1px solid rgba(196, 133, 92, 0.3)", color: "var(--color-copper)" }}>
              {t.category}
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {t.term}
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed" style={{ color: "var(--text-secondary)", textWrap: "balance" } as React.CSSProperties}>
            {t.shortDef}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="section-forge-light relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="prose-lg">
            <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
              {t.fullDef}
            </p>
          </div>

          {/* Related terms */}
          {relatedTerms.length > 0 && (
            <div className="mt-12 pt-10" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Termes liés
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTerms.map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/glossaire/${rt.slug}`}
                    className="group flex items-start gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                        {rt.term}
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{rt.shortDef}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related services */}
          {t.relatedServices && t.relatedServices.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                  Services concernés
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.relatedServices.map((slug) => (
                  <Link
                    key={slug}
                    href={`/services/${slug}`}
                    className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      background: "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-forge-warm relative overflow-hidden py-20 md:py-24">
        <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl leading-[1.1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Question sur <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>{t.term}</span> ?
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
            Notre bureau d&apos;étude répond à vos questions techniques sous 24h.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Button href="/contact">Nous contacter</Button>
            <Button href="/glossaire" variant="secondary">← Retour au glossaire</Button>
          </div>
        </div>
      </section>
    </>
  );
}
