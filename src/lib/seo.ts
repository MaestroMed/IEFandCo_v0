import type { Metadata } from "next";
import { companyInfo } from "@/data/navigation";
import type { FAQItem } from "@/data/faq";

const baseUrl = "https://iefandco.com";

export function generatePageMetadata(page: {
  title: string;
  description: string;
  path: string;
  /** Optional override. If omitted, Next.js uses the closest opengraph-image.tsx (convention). */
  image?: string;
}): Metadata {
  const url = `${baseUrl}${page.path}`;

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: page.title,
    description: page.description,
    url,
    siteName: "IEF & CO",
    locale: "fr_FR",
    type: "website",
  };
  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
  };
  if (page.image) {
    openGraph.images = [{ url: page.image, width: 1200, height: 630, alt: page.title }];
    twitter.images = [page.image];
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph,
    twitter,
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    name: companyInfo.name,
    legalName: companyInfo.fullName,
    description: companyInfo.description,
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    image: [
      `${baseUrl}/opengraph-image`,
      `${baseUrl}/images/photos/hero-welder-dark.jpg`,
    ],
    telephone: companyInfo.phone,
    email: companyInfo.email,
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: companyInfo.president,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      postalCode: companyInfo.address.postalCode,
      addressRegion: companyInfo.address.region,
      addressCountry: companyInfo.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: companyInfo.geo.lat,
      longitude: companyInfo.geo.lng,
    },
    areaServed: companyInfo.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    priceRange: "€€€",
    paymentAccepted: "Carte bancaire, Virement, Chèque",
    currenciesAccepted: "EUR",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    knowsAbout: [
      "Métallerie",
      "Serrurerie",
      "Fermetures industrielles",
      "Portails",
      "Structures métalliques",
      "Portes coupe-feu",
      "Maintenance préventive",
    ],
    sameAs: Object.values(companyInfo.social),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SIREN",
      value: companyInfo.siren,
    },
  };
}

export function generateServiceSchema(service: {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/${service.slug}#service`,
    name: service.title,
    description: service.description,
    url: `${baseUrl}/services/${service.slug}`,
    serviceType: service.title,
    category: "Métallerie & Serrurerie",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#organization`,
      name: companyInfo.name,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Île-de-France",
    },
    audience: {
      "@type": "BusinessAudience",
      name: "Entreprises B2B (logistique, tertiaire, ICPE, ERP)",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/devis`,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
    },
  };
  if (service.imageUrl) {
    schema.image = service.imageUrl;
  }
  return schema;
}

/**
 * DefinedTerm schema for glossary entries — improves rich snippet eligibility.
 */
export function generateDefinedTermSchema(term: {
  term: string;
  shortDef: string;
  fullDef: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.shortDef,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glossaire IEF & CO",
      url: `${baseUrl}/glossaire`,
    },
    url: `${baseUrl}/glossaire/${term.slug}`,
  };
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
