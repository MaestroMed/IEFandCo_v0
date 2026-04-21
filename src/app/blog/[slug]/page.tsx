import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { getBlogPosts, getBlogPostBySlug, getStaticBlogSlugs } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { getBlogPhoto } from "@/lib/photoMap";

export function generateStaticParams() {
  return getStaticBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, blogPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);
  if (!post) notFound();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "IEF & CO",
      logo: { "@type": "ImageObject", url: "https://iefandco.com/logo.png" },
    },
  };

  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, articleSchema]) }}
      />

      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-0 md:pt-40">
        <div className="forge-gradient-dark" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] flex-wrap" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <Link href="/blog" className="hover:opacity-80">Journal</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>{post.category}</span>
          </nav>

          <div className="flex items-center gap-4 mb-8 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--color-copper)" }}>{post.category}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>{post.readingMinutes} min de lecture</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>{post.date}</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {post.title}
          </h1>
          <p className="mt-6 text-base md:text-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {post.excerpt}
          </p>
        </div>

        {/* Hero illustration — hangs over into next section */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 mt-16 -mb-24">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: "1px solid var(--border-strong)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <Photo
              src={getBlogPhoto(post.category)}
              alt={post.title}
              aspect="aspect-[16/9]"
              treatment="default"
              brackets
              priority
              hoverZoom={false}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ ARTICLE BODY (LIGHT) ═══════════ */}
      <article className="section-forge-light relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="forge-gradient-light" style={{ opacity: 0.4 }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          {/* Content — structured sections, editorial typography */}
          <div className="space-y-10">
            {post.sections.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="font-display text-2xl font-bold md:text-3xl leading-tight" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className={`${section.heading ? "mt-5" : ""} ${j > 0 && !section.heading ? "mt-5" : ""} text-base md:text-lg leading-[1.7]`}
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Author attribution */}
          <div className="mt-16 pt-8 flex items-center gap-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(196, 133, 92, 0.2) 0%, rgba(212, 165, 116, 0.1) 100%)",
                border: "1px solid rgba(196, 133, 92, 0.3)",
              }}
            >
              <span className="font-display text-base font-bold" style={{ color: "var(--color-copper)" }}>
                {post.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                Publié par
              </p>
              <p className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>
                {post.author}
              </p>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                  Dans la même catégorie
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--card-shadow)",
                    }}
                  >
                    <Photo
                      src={getBlogPhoto(r.category)}
                      alt={r.title}
                      aspect="aspect-[16/9]"
                      treatment="default"
                      hoverZoom
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="p-5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>
                        {r.readingMinutes} min
                      </span>
                      <h3 className="mt-2 font-display text-base font-bold leading-tight" style={{ color: "var(--text)" }}>
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ═══════════ CTA (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden py-20 md:py-28">
        <div className="forge-gradient-cta" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h3 className="font-display text-3xl font-bold md:text-4xl leading-[1]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            Un projet de <span className="text-gradient-metal">construction métallique</span> ?
          </h3>
          <p className="mt-4 text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Étude gratuite, devis détaillé, un seul interlocuteur — contactez IEF & CO.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button href="/contact" size="lg">Nous contacter</Button>
            <Button href="/devis" variant="secondary" size="lg">Demander un devis</Button>
          </div>
        </div>
      </section>
    </>
  );
}
