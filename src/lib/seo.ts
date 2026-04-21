import type { Metadata } from "next";
import { companyInfo } from "@/data/navigation";
import type { FAQItem } from "@/data/faq";

const baseUrl = "https://iefandco.com";

export function generatePageMetadata(page: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${baseUrl}${page.path}`;
  const image = page.image || `${baseUrl}/og-default.jpg`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "IEF & CO",
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    name: companyInfo.name,
    description: companyInfo.description,
    url: baseUrl,
    telephone: companyInfo.phone,
    email: companyInfo.email,
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
    sameAs: Object.values(companyInfo.social),
    image: `${baseUrl}/images/og-default.jpg`,
  };
}

export function generateServiceSchema(service: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#organization`,
      name: companyInfo.name,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Ile-de-France",
    },
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
