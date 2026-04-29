import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ConfiguredHero } from "@/components/home/ConfiguredHero";
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
import { getServices, getTestimonials, getClients, getHomepageFAQ, getHomepageHero, getPageSeo } from "@/lib/content";

const HOME_TITLE_DEFAULT = "IEF & CO | Métallerie Serrurerie Île-de-France — Groslay (95)";
const HOME_DESCRIPTION_DEFAULT =
  "Métallerie serrurerie B2B en Île-de-France : fermetures industrielles, portails, structures métalliques, menuiserie, portes coupe-feu, automatismes. Maintenance 24/7, intervention sous 4h sous contrat. Devis gratuit.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  const title = seo?.title || HOME_TITLE_DEFAULT;
  const description = seo?.description || HOME_DESCRIPTION_DEFAULT;
  const ogImage = seo?.ogImageUrl;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "https://iefandco.com/",
      siteName: "IEF & CO",
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function HomePage() {
  const [services, testimonials, clients, homepageFAQ, hero] = await Promise.all([
    getServices(),
    getTestimonials(),
    getClients(),
    getHomepageFAQ(),
    getHomepageHero(),
  ]);

  return (
    <>
      {hero ? <ConfiguredHero {...hero} /> : <HeroSection />}
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
