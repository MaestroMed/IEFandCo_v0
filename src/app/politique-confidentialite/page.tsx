import type { Metadata } from "next";
import { companyInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description: "Politique de confidentialite du site IEF & CO.",
};

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
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Donnees collectees</h2>
            <p>Les donnees collectees via les formulaires de contact et de devis comprennent : nom, prenom, email, telephone, societe, et le contenu du message. Ces donnees sont utilisees exclusivement pour repondre a vos demandes.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Duree de conservation</h2>
            <p>Les donnees sont conservees pendant une duree de 3 ans a compter du dernier contact, conformement a la reglementation en vigueur.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>Vos droits</h2>
            <p>Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification, de suppression et de portabilite de vos donnees. Pour exercer ces droits, contactez-nous a {companyInfo.email}.</p>
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
