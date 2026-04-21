import type { MetadataRoute } from "next";
import { getServices, getBlogPosts, getRealisations } from "@/lib/content";
import { zones } from "@/data/zones";
import { brands } from "@/data/brands";
import { comparatifs } from "@/data/comparatifs";
import { glossary } from "@/data/glossary";
import { depannageServices } from "@/data/depannage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://iefandco.com";

  const [services, blogPosts, realisations] = await Promise.all([
    getServices(),
    getBlogPosts(),
    getRealisations(),
  ]);

  const realisationPages: MetadataRoute.Sitemap = realisations.map((r) => ({
    url: `${baseUrl}/realisations/${r.slug}`,
    lastModified: new Date(`${r.year}-01-01`),
    changeFrequency: "yearly",
    priority: 0.75,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/realisations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/devis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/assisteo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/zones-intervention`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comparatifs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossaire`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/maintenance/contrats`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/depannage`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/estimateur`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  // Combos zone × service dépannage — 40 URLs stratégiques pour SEO local
  const depannageCombos: MetadataRoute.Sitemap = [];
  for (const s of depannageServices) {
    for (const z of zones) {
      depannageCombos.push({
        url: `${baseUrl}/depannage/${s.slug}/${z.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const zonePages: MetadataRoute.Sitemap = zones.map((z) => ({
    url: `${baseUrl}/zones/${z.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${baseUrl}/maintenance/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const comparatorPages: MetadataRoute.Sitemap = comparatifs.map((c) => ({
    url: `${baseUrl}/comparatif/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const glossaryPages: MetadataRoute.Sitemap = glossary.map((t) => ({
    url: `${baseUrl}/glossaire/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...servicePages,
    ...blogPages,
    ...zonePages,
    ...brandPages,
    ...comparatorPages,
    ...glossaryPages,
    ...depannageCombos,
    ...realisationPages,
    ...legalPages,
  ];
}
