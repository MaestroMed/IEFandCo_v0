import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { BureauEtude } from "@/components/home/BureauEtude";
import { StatsForge } from "@/components/home/StatsForge";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Testimonials } from "@/components/home/Testimonials";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { FAQSection } from "@/components/home/FAQSection";
import { Newsletter } from "@/components/home/Newsletter";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getServices, getTestimonials, getClients, getHomepageFAQ } from "@/lib/content";

const HOME_TITLE = "IEF & CO | Métallerie Serrurerie Île-de-France — Groslay (95)";
const HOME_DESCRIPTION =
  "Métallerie serrurerie B2B en Île-de-France : fermetures industrielles, portails, structures métalliques, menuiserie, portes coupe-feu, automatismes. Maintenance 24/7, intervention sous 4h sous contrat. Devis gratuit.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://iefandco.com/",
    siteName: "IEF & CO",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    // Images : Next.js auto-utilise src/app/opengraph-image.tsx (convention)
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    // Images : Next.js auto-utilise opengraph-image.tsx en fallback Twitter
  },
};

export default async function HomePage() {
  const [services, testimonials, clients, homepageFAQ] = await Promise.all([
    getServices(),
    getTestimonials(),
    getClients(),
    getHomepageFAQ(),
  ]);

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesGrid services={services} />
      <BureauEtude />
      <StatsForge />
      <ClientLogos clients={clients} />
      <Testimonials testimonials={testimonials} />
      <GoogleReviews />
      <FAQSection items={homepageFAQ} />
      <Newsletter />
      <ContactCTA />
    </>
  );
}
