import type { Metadata } from "next";
import { companyInfo } from "@/data/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { getPageSeo } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("politique-confidentialite");
  return generatePageMetadata({
    title: seo?.title || "Politique de confidentialité",
    description:
      seo?.description ||
      "Politique de confidentialité du site IEF & CO — données collectées, durée, droits RGPD, cookies.",
    path: "/politique-confidentialite",
    image: seo?.ogImageUrl,
  });
}

export default function PolitiqueConfidentialite() {
  return (
    <section className="section-forge-light relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen">
      <div className="forge-gradient-light" style={{ opacity: 0.4 }} />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
            RGPD
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1]" style={{ color: "var(--text)" }}>
          Politique de confidentialité
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Responsable du traitement</h2>
            <p>{companyInfo.fullName}, {companyInfo.address.street}, {companyInfo.address.postalCode} {companyInfo.address.city}.</p>
            <p>Contact : {companyInfo.email}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Données collectées</h2>
            <p>Les données collectées via les formulaires de contact et de devis comprennent : nom, prénom, email, téléphone, société, et le contenu du message. Ces données sont utilisées exclusivement pour répondre à vos demandes.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Durée de conservation</h2>
            <p>Les données sont conservées pendant une durée de 3 ans à compter du dernier contact, conformément à la réglementation en vigueur.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Vos droits</h2>
            <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à {companyInfo.email}.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Cookies</h2>
            <p>Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking n&apos;est utilisé.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
