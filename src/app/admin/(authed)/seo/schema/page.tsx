import { Topbar } from "@/components/admin/Topbar";
import { Tag } from "lucide-react";
import { companyInfo } from "@/data/navigation";

export const dynamic = "force-dynamic";

interface SchemaItem {
  name: string;
  description: string;
  pages: string;
  json: object;
}

function buildSchemas(): SchemaItem[] {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name,
    description: companyInfo.description,
    url: companyInfo.website,
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: companyInfo.areaServed,
    sameAs: [companyInfo.social.linkedin],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Fermetures industrielles",
    provider: { "@type": "Organization", name: companyInfo.name },
    areaServed: { "@type": "Place", name: "Ile-de-France" },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Intervenez-vous en urgence ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, sous 24/48h en Ile-de-France pour les depannages.",
        },
      },
    ],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: companyInfo.website },
      { "@type": "ListItem", position: 2, name: "Services", item: `${companyInfo.website}/services` },
    ],
  };

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Titre de l'article",
    author: { "@type": "Organization", name: companyInfo.name },
    datePublished: "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: companyInfo.name,
      logo: { "@type": "ImageObject", url: `${companyInfo.website}/logo.png` },
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: companyInfo.name,
    url: companyInfo.website,
    potentialAction: {
      "@type": "SearchAction",
      target: `${companyInfo.website}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.fullName,
    url: companyInfo.website,
    logo: `${companyInfo.website}/logo.png`,
    foundingDate: String(companyInfo.founded),
    founder: { "@type": "Person", name: companyInfo.president },
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      postalCode: companyInfo.address.postalCode,
      addressCountry: companyInfo.address.country,
    },
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: companyInfo.president,
    jobTitle: "President",
    worksFor: { "@type": "Organization", name: companyInfo.fullName },
  };

  return [
    { name: "LocalBusiness", description: "Etablissement local avec coordonnees, geo et horaires", pages: "Toutes (layout)", json: localBusiness },
    { name: "Service", description: "Service propose (instance par categorie)", pages: "/services/*", json: service },
    { name: "FAQPage", description: "Liste de questions frequentes", pages: "Homepage, /services/*", json: faqPage },
    { name: "BreadcrumbList", description: "Fil d'ariane structure", pages: "Toutes pages internes", json: breadcrumb },
    { name: "BlogPosting", description: "Article de blog", pages: "/blog/[slug]", json: blogPosting },
    { name: "WebSite", description: "Site avec recherche potentielle", pages: "Homepage", json: website },
    { name: "Organization", description: "L'entite IEF & CO", pages: "Toutes (layout)", json: organization },
    { name: "Person", description: "Le president (sameAs LinkedIn)", pages: "/a-propos", json: person },
  ];
}

export default function SchemaPreviewPage() {
  const items = buildSchemas();

  return (
    <>
      <Topbar
        title="Schema.org"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "SEO", href: "/admin/seo" },
          { label: "Schema.org" },
        ]}
      />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {items.length} schemas actifs sur le site (lecture seule).
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <section
              key={item.name}
              className="rounded-xl p-6 space-y-3"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0" style={{ background: "var(--bg-muted)" }}>
                  <Tag className="h-5 w-5" style={{ color: "var(--color-copper)" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>{item.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                      {item.pages}
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                </div>
              </div>

              <pre
                className="rounded-lg p-4 overflow-x-auto text-[11px] font-mono leading-relaxed"
                style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <code dangerouslySetInnerHTML={{ __html: highlightJson(item.json) }} />
              </pre>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightJson(obj: unknown): string {
  const json = JSON.stringify(obj, null, 2);
  // Highlight: keys in copper, strings in normal text, numbers/booleans in copper-light
  // We escape first then apply color via inline style.
  return escapeHtml(json)
    .replace(
      /(&quot;[^&]*?&quot;)\s*:/g,
      (_m, key) => `<span style="color: var(--color-copper)">${key}</span>:`,
    )
    .replace(
      /:\s*(&quot;[^&]*?&quot;)/g,
      (_m, val) => `: <span style="color: var(--text-secondary)">${val}</span>`,
    )
    .replace(
      /:\s*(\d+\.?\d*|true|false|null)/g,
      (_m, val) => `: <span style="color: var(--color-copper)">${val}</span>`,
    );
}
