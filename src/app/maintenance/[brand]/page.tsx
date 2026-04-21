import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, getBrandBySlug } from "@/data/brands";
import { Button } from "@/components/ui/Button";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrandBySlug(brand);
  if (!b) return {};
  return generatePageMetadata({
    title: b.seo.title,
    description: b.seo.description,
    path: `/maintenance/${b.slug}`,
  });
}

export default async function BrandMaintenancePage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Maintenance", url: "/services/maintenance" },
    { name: brand.name, url: `/maintenance/${brand.slug}` },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brand.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  // Group products by family
  const productsByFamily = brand.products.reduce<Record<string, typeof brand.products>>((acc, p) => {
    if (!acc[p.family]) acc[p.family] = [];
    acc[p.family].push(p);
    return acc;
  }, {});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, faqSchema]) }}
      />

      {/* HERO */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 30% 40%, rgba(${brand.accentColor}, 0.20) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 75% 60%, rgba(${brand.accentColor}, 0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 20% 90%, rgba(225, 16, 33, 0.05) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 blueprint-grid pointer-events-none" style={{ opacity: 0.05 }} />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/services/maintenance" className="hover:opacity-80">Maintenance</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: `rgb(${brand.accentColor})` }}>{brand.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: `rgb(${brand.accentColor})` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${brand.accentColor})` }}>
              Spécialiste {brand.name}
            </span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Maintenance <span style={{ color: `rgb(${brand.accentColor})` }}>{brand.name}</span><br />
            <span className="text-gradient-metal">en Île-de-France</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {brand.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`/devis?marque=${brand.slug}`} size="lg">Devis maintenance {brand.name}</Button>
            <Button href="/contact" variant="secondary" size="lg">Nous contacter</Button>
          </div>
        </div>
      </section>

      {/* INTRO LONG */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ background: `rgb(${brand.accentColor})` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${brand.accentColor})` }}>
              Notre expertise {brand.name}
            </span>
          </div>
          <p className="text-base md:text-lg leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
            {brand.intro}
          </p>

          {/* Advantages */}
          <div className="mt-10">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5" style={{ color: "var(--color-copper)" }}>
              Pourquoi nous choisir pour votre parc {brand.name}
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {brand.advantages.map((adv, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <svg className="h-5 w-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: `rgb(${brand.accentColor})` }}>
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS BY FAMILY */}
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Gamme couverte
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Produits {brand.name} <br />
              <span className="text-gradient-metal">que nous maintenons</span>
            </h2>
          </div>

          <div className="space-y-10">
            {Object.entries(productsByFamily).map(([family, products]) => (
              <div key={family}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `rgb(${brand.accentColor})` }}>
                    Famille {family}
                  </span>
                  <span className="h-px flex-1" style={{ background: "var(--border)" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    {products.length} modèles
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {products.map((p, i) => (
                    <div key={i} className="glass-card rounded-xl p-5">
                      <div className="font-display text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
                        {p.name}
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMON FAILURES */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                Pannes courantes {brand.name}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Diagnostics les plus fréquents
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {brand.commonFailures.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold"
                    style={{
                      background: `rgba(${brand.accentColor}, 0.12)`,
                      color: `rgb(${brand.accentColor})`,
                      border: `1px solid rgba(${brand.accentColor}, 0.25)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-base font-bold" style={{ color: "var(--text)" }}>
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTS IN STOCK */}
      <section className="section-forge-warm relative overflow-hidden py-24 md:py-32">
        <div className="forge-gradient-warm" style={{ opacity: 0.5 }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Stock permanent {brand.name}
              </span>
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              Pièces détachées en stock
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
              90% de nos interventions {brand.name} sont résolues au premier passage grâce à notre stock atelier.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {brand.partsInStock.map((p, i) => (
              <span
                key={i}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: "rgba(255, 252, 245, 0.8)",
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

      {/* FAQ */}
      <section className="section-forge-light relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                FAQ {brand.name}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--text)" }}>
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {brand.faq.map((q, i) => (
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
                <div className="px-6 pb-6 pl-4 border-l-2 ml-6" style={{ borderColor: `rgba(${brand.accentColor}, 0.3)` }}>
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
      <section className="section-forge-dark relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 40% at 50% 50%, rgba(${brand.accentColor}, 0.20) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196, 133, 92, 0.10) 0%, transparent 55%)`,
          }}
        />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Votre parc <span style={{ color: `rgb(${brand.accentColor})` }}>{brand.name}</span> mérite mieux
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Audit gratuit de votre parc {brand.name}, devis personnalisé sous 48h, contrat de maintenance adapté.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href={`/devis?marque=${brand.slug}`} size="lg">Devis {brand.name}</Button>
            <Button href="/maintenance/contrats" variant="secondary" size="lg">Voir nos contrats</Button>
          </div>
        </div>
      </section>
    </>
  );
}
