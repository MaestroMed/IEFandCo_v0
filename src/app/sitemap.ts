import type { MetadataRoute } from "next";
import { getServices, getBlogPosts, getRealisations } from "@/lib/content";
import { zones } from "@/data/zones";
import { brands } from "@/data/brands";
import { comparatifs } from "@/data/comparatifs";
import { glossary } from "@/data/glossary";
import { depannageServices } from "@/data/depannage";

/**
 * Sitemap last-modified strategy :
 *   - Static pages : a SITE_LAST_REVISED constant bumped on real content
 *     edits. Avoids re-crawl pressure each deploy when content didn't move.
 *   - DB-backed content (services, blog, projects) : the entity's `updatedAt`
 *     when available, otherwise SITE_LAST_REVISED.
 *   - Static-data content (zones, brands, comparators, glossary, depannage) :
 *     SITE_LAST_REVISED until the DB tables become the source of truth and
 *     expose updatedAt.
 */
const SITE_LAST_REVISED = new Date("2026-05-01T00:00:00.000Z");

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
    { url: baseUrl, lastModified: SITE_LAST_REVISED, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/a-propos`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/realisations`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: SITE_LAST_REVISED, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: SITE_LAST_REVISED, changeFrequency: "yearly", priority: 0.8 },
    { url: `${baseUrl}/devis`, lastModified: SITE_LAST_REVISED, changeFrequency: "yearly", priority: 0.9 },
    { url: `${baseUrl}/assisteo`, lastModified: SITE_LAST_REVISED, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/zones-intervention`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/comparatifs`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossaire`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/maintenance/contrats`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/depannage`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/estimateur`, lastModified: SITE_LAST_REVISED, changeFrequency: "monthly", priority: 0.9 },
  ];

  // Combos zone × service dépannage — 40 URLs stratégiques pour SEO local
  const depannageCombos: MetadataRoute.Sitemap = [];
  for (const s of depannageServices) {
    for (const z of zones) {
      depannageCombos.push({
        url: `${baseUrl}/depannage/${s.slug}/${z.slug}`,
        lastModified: SITE_LAST_REVISED,
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: SITE_LAST_REVISED,
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
    lastModified: SITE_LAST_REVISED,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${baseUrl}/maintenance/${b.slug}`,
    lastModified: SITE_LAST_REVISED,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const comparatorPages: MetadataRoute.Sitemap = comparatifs.map((c) => ({
    url: `${baseUrl}/comparatif/${c.slug}`,
    lastModified: SITE_LAST_REVISED,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const glossaryPages: MetadataRoute.Sitemap = glossary.map((t) => ({
    url: `${baseUrl}/glossaire/${t.slug}`,
    lastModified: SITE_LAST_REVISED,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/mentions-legales`, lastModified: SITE_LAST_REVISED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/politique-confidentialite`, lastModified: SITE_LAST_REVISED, changeFrequency: "yearly", priority: 0.3 },
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
