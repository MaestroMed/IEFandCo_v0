import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { BureauEtude } from "@/components/home/BureauEtude";
import { StatsForge } from "@/components/home/StatsForge";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getServices, getTestimonials, getClients, getHomepageFAQ } from "@/lib/content";

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
      <FAQSection items={homepageFAQ} />
      <ContactCTA />
    </>
  );
}
