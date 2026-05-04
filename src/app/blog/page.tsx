import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { Photo } from "@/components/ui/Photo";
import { WorkshopAtmosphere } from "@/components/ui/WorkshopAtmosphere";
import { getBlogPosts, getPageSeo, getPageHero } from "@/lib/content";
import { getBlogPhoto, ATMOSPHERE } from "@/lib/photoMap";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("blog-index");
  return generatePageMetadata({
    title: seo?.title || "Blog | Actualités métallerie & serrurerie",
    description:
      seo?.description ||
      "Articles techniques, guides et actualités sur la métallerie, les fermetures industrielles et la maintenance. Blog IEF & CO.",
    path: "/blog",
    image: seo?.ogImageUrl,
  });
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const heroOverride = await getPageHero("blog-index");
  const [featured, ...rest] = blogPosts;

  return (
    <>
      {/* ═══════════ HERO (DARK) ═══════════ */}
      <section className="section-forge-dark relative overflow-hidden pt-32 pb-20 md:pt-40">
        {/* Branded background — editorial blog atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={heroOverride?.imageUrl || ATMOSPHERE.heroBlog}
            alt={heroOverride?.imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: heroOverride?.objectPosition || "center 50%",
              opacity: (heroOverride?.opacity ?? 100) / 100,
              filter: "contrast(1.05) brightness(0.95) saturate(1.05)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                `linear-gradient(105deg, #050508 18%, rgba(5, 5, 8, ${(heroOverride?.overlayLeft ?? 70) / 100}) 38%, rgba(5, 5, 8, 0.18) 65%, rgba(5, 5, 8, 0) 100%)`,
            }}
          />
        </div>

        <div className="forge-gradient-dark" style={{ opacity: 0.5 }} />
        <WorkshopAtmosphere intensity={0.4} origin="bottom" />
        <div className="grain absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:opacity-80">Accueil</Link>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--color-copper)" }}>Journal</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ background: "var(--color-copper)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
              {heroOverride?.eyebrow || `Journal${blogPosts.length > 0 ? ` · ${blogPosts.length} articles` : ""}`}
            </span>
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-[0.95]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
            {heroOverride?.title ? <>{heroOverride.title}</> : <>Le <span className="text-gradient-metal">journal</span> de la métallerie</>}
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            {heroOverride?.intro || "Guides techniques, retours de chantier, normes et études de cas. Tout ce qu'on apprend, on le partage ici."}
          </p>
        </div>
      </section>

      {/* ═══════════ FEATURED ARTICLE (LIGHT) ═══════════ */}
      {featured && (
        <section className="section-forge-light relative overflow-hidden py-16 md:py-24">
          <div className="forge-gradient-light" style={{ opacity: 0.5 }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-primary)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-primary)" }}>
                À la une
              </span>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 overflow-hidden rounded-3xl lg:grid-cols-5 lg:gap-12 transition-all hover:-translate-y-1"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow-hover)",
              }}
            >
              <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto overflow-hidden relative">
                <Photo
                  src={
                    featured.coverUrl && !featured.coverMime?.startsWith("video/")
                      ? featured.coverUrl
                      : getBlogPhoto(featured.category)
                  }
                  alt={featured.coverAlt || featured.title}
                  treatment="default"
                  hoverZoom
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="absolute inset-0"
                />
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center p-8 lg:p-10 lg:pr-12">
                <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                  <span style={{ color: "var(--color-copper)" }}>{featured.category}</span>
                  <span style={{ color: "var(--border-strong)" }}>·</span>
                  <span>{featured.readingMinutes} min</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold leading-tight md:text-3xl lg:text-4xl" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-secondary)" }}>
                  {featured.excerpt}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-copper)" }}>
                  <span>Lire l&apos;article</span>
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════ REST OF ARTICLES (LIGHT) ═══════════ */}
      {rest.length > 0 && (
        <section className="section-forge-light relative overflow-hidden pb-28 md:pb-36">
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Plus récents
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--card-shadow)",
                  }}
                >
                  <Photo
                    src={
                      post.coverUrl && !post.coverMime?.startsWith("video/")
                        ? post.coverUrl
                        : getBlogPhoto(post.category)
                    }
                    alt={post.coverAlt || post.title}
                    aspect="aspect-[16/10]"
                    treatment="default"
                    hoverZoom
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span style={{ color: "var(--color-copper)" }}>{post.category}</span>
                      <span style={{ color: "var(--text-muted)" }}>{post.readingMinutes} min</span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-bold leading-tight" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-xs font-mono uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
                      {post.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
