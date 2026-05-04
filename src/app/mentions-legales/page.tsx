import type { Metadata } from "next";
import { companyInfo } from "@/data/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo, getLegalContent } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("mentions-legales");
  return generatePageMetadata({
    title: seo?.title || "Mentions légales",
    description:
      seo?.description ||
      "Mentions légales du site IEF & CO — éditeur, hébergement, propriété intellectuelle.",
    path: "/mentions-legales",
    image: seo?.ogImageUrl,
  });
}

export default async function MentionsLegales() {
  const customMarkdown = await getLegalContent("mentions");
  const customHtml = customMarkdown ? markdownToHtml(customMarkdown) : null;

  return (
    <section className="section-forge-light relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen">
      <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
            Informations légales
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)" }}>
          Mentions légales
        </h1>

        {customHtml ? (
          <div
            className="mt-10 space-y-3 text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
            dangerouslySetInnerHTML={{ __html: customHtml }}
          />
        ) : (
          <div className="mt-10 space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <section>
              <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Éditeur du site</h2>
              <p>{companyInfo.fullName}</p>
              <p>{companyInfo.address.street}, {companyInfo.address.postalCode} {companyInfo.address.city}</p>
              <p>SIREN : {companyInfo.siren}</p>
              <p>RCS : {companyInfo.rcs}</p>
              <p>Capital social : {companyInfo.capital} EUR</p>
              <p>Président : {companyInfo.president}</p>
              <p>Téléphone : {companyInfo.phoneDisplay}</p>
              <p>Email : {companyInfo.email}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Hébergement</h2>
              <p>Ce site est hébergé par Vercel Inc., 440 N Bayard St #201, Wilmington, DE 19801, USA.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Propriété intellectuelle</h2>
              <p>L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes) est protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
