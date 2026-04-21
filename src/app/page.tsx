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
