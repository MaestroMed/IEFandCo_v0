/**
 * Content Adapter
 *
 * Single source of truth for public-facing content. Reads from the database
 * (managed via the admin) and falls back to static seeds in src/data/* when
 * the DB is empty or unavailable. This lets the admin edits propagate to the
 * public site immediately without breaking when the DB is down.
 *
 * Server-only — these functions touch the SQLite client.
 */

import "server-only";
import { db, schema, isDbConfigured } from "@/db";
import { eq, asc, desc, inArray } from "drizzle-orm";

import { services as staticServices, type Service } from "@/data/services";
import { testimonials as staticTestimonials, type Testimonial } from "@/data/testimonials";
import { clients as staticClients, type Client } from "@/data/clients";
import { homepageFAQ as staticHomepageFAQ, type FAQItem } from "@/data/faq";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/data/blog";
import { realisations as staticRealisations, type Realisation } from "@/data/realisations";
import { glossary as staticGlossary, type GlossaryTerm } from "@/data/glossary";
import { zones as staticZones, type Zone } from "@/data/zones";
import { brands as staticBrands, type Brand } from "@/data/brands";
import { comparatifs as staticComparatifs, type Comparator } from "@/data/comparatifs";
import { depannageServices as staticDepannageServices, type DepannageService } from "@/data/depannage";
import { companyInfo as staticCompanyInfo } from "@/data/navigation";

/* ─────────── Helpers ─────────── */

async function getMediaUrlMap(mediaIds: (string | null | undefined)[]): Promise<Map<string, string>> {
  const ids = Array.from(new Set(mediaIds.filter((id): id is string => Boolean(id))));
  if (ids.length === 0) return new Map();
  try {
    const rows = await db.select({ id: schema.media.id, url: schema.media.url }).from(schema.media);
    return new Map(rows.filter((r) => ids.includes(r.id)).map((r) => [r.id, r.url]));
  } catch {
    return new Map();
  }
}

interface MediaMeta {
  url: string;
  mime: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  caption?: string | null;
}

async function getMediaMetaMap(mediaIds: (string | null | undefined)[]): Promise<Map<string, MediaMeta>> {
  const ids = Array.from(new Set(mediaIds.filter((id): id is string => Boolean(id))));
  if (ids.length === 0) return new Map();
  try {
    const rows = await db.select().from(schema.media).where(inArray(schema.media.id, ids));
    return new Map(
      rows.map((r) => [
        r.id,
        { url: r.url, mime: r.mime, alt: r.alt, width: r.width, height: r.height },
      ]),
    );
  } catch {
    return new Map();
  }
}

/* ─────────── Services ─────────── */

export async function getServices(): Promise<Service[]> {
  if (!isDbConfigured()) return staticServices;
  try {
    const dbRows = await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.visible, true))
      .orderBy(asc(schema.services.orderIdx));

    if (dbRows.length === 0) return staticServices;

    const allSubs = await db.select().from(schema.subServices);
    const allFaqs = await db
      .select()
      .from(schema.serviceFaqs)
      .where(eq(schema.serviceFaqs.scope, "service"));
    const mediaMap = await getMediaMetaMap(dbRows.map((r) => r.coverMediaId));

    return dbRows.map((s) => {
      const fallback = staticServices.find((x) => x.slug === s.slug);
      const subs = allSubs
        .filter((sub) => sub.serviceId === s.id)
        .sort((a, b) => a.orderIdx - b.orderIdx)
        .map(({ title, description }) => ({ title, description }));
      const faqs = allFaqs
        .filter((f) => f.serviceId === s.id)
        .sort((a, b) => a.orderIdx - b.orderIdx)
        .map(({ question, answer }) => ({ question, answer }));
      const cover = s.coverMediaId ? mediaMap.get(s.coverMediaId) : undefined;

      return {
        slug: s.slug,
        title: s.title,
        shortTitle: s.shortTitle,
        shortDescription: s.shortDescription,
        accentColor: s.accentColor || fallback?.accentColor || "196, 133, 92",
        fullDescription: s.fullDescription || fallback?.fullDescription || s.shortDescription,
        icon: s.icon,
        subServices: subs.length > 0 ? subs : (fallback?.subServices || []),
        faq: faqs.length > 0 ? faqs : (fallback?.faq || []),
        relatedSlugs: fallback?.relatedSlugs || [],
        coverUrl: cover?.url,
        coverMime: cover?.mime,
        coverAlt: cover?.alt || s.title,
        seo: {
          title: s.seoTitle || fallback?.seo.title || s.title,
          description: s.seoDescription || fallback?.seo.description || s.shortDescription,
        },
      };
    });
  } catch (err) {
    console.warn("[content] getServices failed, falling back to static:", err);
    return staticServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

export async function getRelatedServices(slug: string, limit = 3): Promise<Service[]> {
  const all = await getServices();
  const current = all.find((s) => s.slug === slug);
  if (!current) return [];
  const byRelated = (current.relatedSlugs || [])
    .map((rs) => all.find((s) => s.slug === rs))
    .filter((s): s is Service => Boolean(s));
  if (byRelated.length >= limit) return byRelated.slice(0, limit);
  // Fill with other services
  const others = all.filter((s) => s.slug !== slug && !byRelated.find((r) => r.slug === s.slug));
  return [...byRelated, ...others].slice(0, limit);
}

/* ─────────── Testimonials ─────────── */

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDbConfigured()) return staticTestimonials;
  try {
    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.visible, true))
      .orderBy(asc(schema.testimonials.orderIdx));

    if (rows.length === 0) return staticTestimonials;

    const mediaMap = await getMediaUrlMap(rows.map((r) => r.photoMediaId));

    return rows.map((r, i) => ({
      id: i + 1,
      name: r.author,
      company: r.company || "",
      text: r.quote,
      rating: r.rating || 5,
      photoUrl: r.photoMediaId ? mediaMap.get(r.photoMediaId) : undefined,
    }));
  } catch (err) {
    console.warn("[content] getTestimonials failed, falling back to static:", err);
    return staticTestimonials;
  }
}

/* ─────────── Clients ─────────── */

export async function getClients(): Promise<Client[]> {
  if (!isDbConfigured()) return staticClients;
  try {
    const rows = await db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.visible, true))
      .orderBy(asc(schema.clients.orderIdx));

    if (rows.length === 0) return staticClients;

    const mediaMap = await getMediaUrlMap(rows.map((r) => r.logoMediaId));

    return rows.map((r) => ({
      name: r.name,
      logo: r.logoMediaId ? (mediaMap.get(r.logoMediaId) || "") : "",
    }));
  } catch (err) {
    console.warn("[content] getClients failed, falling back to static:", err);
    return staticClients;
  }
}

/* ─────────── Homepage FAQ ─────────── */

export async function getHomepageFAQ(): Promise<FAQItem[]> {
  if (!isDbConfigured()) return staticHomepageFAQ;
  try {
    const rows = await db
      .select()
      .from(schema.serviceFaqs)
      .where(eq(schema.serviceFaqs.scope, "homepage"))
      .orderBy(asc(schema.serviceFaqs.orderIdx));

    if (rows.length === 0) return staticHomepageFAQ;

    return rows.map(({ question, answer }) => ({ question, answer }));
  } catch (err) {
    console.warn("[content] getHomepageFAQ failed, falling back to static:", err);
    return staticHomepageFAQ;
  }
}

/* ─────────── Team ─────────── */

export interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  initials: string;
  photoUrl?: string;
}

const staticTeam: TeamMember[] = [
  { name: "Otman Fariad", role: "Président / Fondateur", expertise: "Expert métallerie et gestion de projet. Pilotage technique et commercial des projets, de l'étude à la livraison.", initials: "OF" },
  { name: "Bureau d'étude", role: "Conception & calcul", expertise: "Modélisation 3D, notes de calcul Eurocode 3, plans d'exécution, dimensionnement structurel conforme EN 1090.", initials: "BE" },
  { name: "Atelier", role: "Fabrication & soudure", expertise: "Soudeurs qualifiés MAG/TIG, travail de l'acier, inox et aluminium. Contrôle qualité par WPQR et certificats matière.", initials: "AT" },
  { name: "Chantier", role: "Pose & installation", expertise: "Équipes terrain formées au travail en hauteur, levage, coordination avec les autres corps d'état sur chantier.", initials: "CH" },
];

export async function getTeam(): Promise<TeamMember[]> {
  if (!isDbConfigured()) return staticTeam;
  try {
    const rows = await db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.visible, true))
      .orderBy(asc(schema.teamMembers.orderIdx));

    if (rows.length === 0) return staticTeam;

    const mediaMap = await getMediaUrlMap(rows.map((r) => r.photoMediaId));

    return rows.map((r) => ({
      name: r.name,
      role: r.role,
      expertise: r.expertise,
      initials: r.initials,
      photoUrl: r.photoMediaId ? mediaMap.get(r.photoMediaId) : undefined,
    }));
  } catch (err) {
    console.warn("[content] getTeam failed, falling back to static:", err);
    return staticTeam;
  }
}

/* ─────────── Blog ─────────── */

function htmlToSections(html: string): { paragraphs: string[]; heading?: string }[] {
  // Simple HTML → sections converter — splits by <h2> tags
  const sections: { paragraphs: string[]; heading?: string }[] = [];
  const parts = html.split(/<h2[^>]*>(.*?)<\/h2>/gi);
  // parts: [textBeforeFirstH2, h2_1_text, textAfterH2_1, h2_2_text, textAfterH2_2, ...]
  let i = 0;
  while (i < parts.length) {
    const heading = i === 0 ? undefined : parts[i - 1];
    const block = parts[i];
    const paragraphs = block
      .split(/<\/?p[^>]*>/gi)
      .map((p) => p.replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);
    if (paragraphs.length > 0 || heading) {
      sections.push({ heading, paragraphs });
    }
    i += 2;
  }
  return sections.length > 0 ? sections : [{ paragraphs: [html.replace(/<[^>]+>/g, "").trim()] }];
}

function fmtDateFr(d: Date): string {
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isDbConfigured()) return staticBlogPosts;
  try {
    const rows = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.status, "published"))
      .orderBy(desc(schema.blogPosts.publishedAt));

    if (rows.length === 0) return staticBlogPosts;

    const mediaMap = await getMediaMetaMap(rows.map((r) => r.coverMediaId));

    return rows.map((r) => {
      const fallback = staticBlogPosts.find((p) => p.slug === r.slug);
      const date = r.publishedAt || new Date();
      const html = r.contentHtml || "";
      const cover = r.coverMediaId ? mediaMap.get(r.coverMediaId) : undefined;
      return {
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt || fallback?.excerpt || "",
        date: fmtDateFr(date),
        dateISO: date.toISOString().slice(0, 10),
        category: r.category,
        author: "IEF & CO",
        readingMinutes: r.readingMinutes || 5,
        sections: html ? htmlToSections(html) : (fallback?.sections || []),
        coverUrl: cover?.url,
        coverMime: cover?.mime,
        coverAlt: cover?.alt || r.title,
        seoTitle: r.seoTitle || fallback?.seoTitle,
        seoDescription: r.seoDescription || fallback?.seoDescription,
      };
    });
  } catch (err) {
    console.warn("[content] getBlogPosts failed, falling back to static:", err);
    return staticBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug);
}

/* ─────────── Realisations / Projects ─────────── */

export async function getRealisations(): Promise<Realisation[]> {
  if (!isDbConfigured()) return staticRealisations;
  try {
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.status, "published"))
      .orderBy(asc(schema.projects.orderIdx), desc(schema.projects.createdAt));

    if (rows.length === 0) return staticRealisations;

    const mediaMap = await getMediaMetaMap(rows.map((r) => r.coverMediaId));

    return rows.map((r) => {
      const fallback = staticRealisations.find((p) => p.slug === r.slug);
      const cover = r.coverMediaId ? mediaMap.get(r.coverMediaId) : undefined;
      return {
        slug: r.slug,
        title: r.title,
        category: (r.category as Realisation["category"]) || fallback?.category || "structures",
        client: r.clientName || fallback?.client || "—",
        year: r.year || fallback?.year || new Date().getFullYear(),
        location: r.location || fallback?.location || "Île-de-France",
        description: r.description || fallback?.description || "",
        highlight: r.highlight || fallback?.highlight || "",
        // Rich case-study fields fall back to static (until projects schema gains them)
        tagline: fallback?.tagline,
        challenge: r.challenge || fallback?.challenge,
        solution: r.solution || fallback?.solution,
        result: r.result || fallback?.result,
        kpis: fallback?.kpis,
        phases: fallback?.phases,
        specs: fallback?.specs,
        standards: fallback?.standards,
        testimonial: fallback?.testimonial,
        seoTitle: r.seoTitle || fallback?.seoTitle,
        seoDescription: r.seoDescription || fallback?.seoDescription,
        coverUrl: cover?.url,
        coverMime: cover?.mime,
        coverAlt: cover?.alt || r.title,
      };
    });
  } catch (err) {
    console.warn("[content] getRealisations failed, falling back to static:", err);
    return staticRealisations;
  }
}

export async function getRealisationBySlug(slug: string): Promise<Realisation | undefined> {
  const all = await getRealisations();
  return all.find((p) => p.slug === slug);
}

/**
 * Returns the gallery (multi-image) for a project, in order. Used in
 * /realisations/[slug]. Falls back to empty array if the project has no
 * extra images.
 */
export async function getProjectGallery(projectSlug: string): Promise<MediaMeta[]> {
  if (!isDbConfigured()) return [];
  try {
    const project = (
      await db.select().from(schema.projects).where(eq(schema.projects.slug, projectSlug)).limit(1)
    )[0];
    if (!project) return [];

    const imgRows = await db
      .select()
      .from(schema.projectImages)
      .where(eq(schema.projectImages.projectId, project.id))
      .orderBy(asc(schema.projectImages.orderIdx));
    if (imgRows.length === 0) return [];

    const mediaMap = await getMediaMetaMap(imgRows.map((i) => i.mediaId));
    const out: MediaMeta[] = [];
    for (const i of imgRows) {
      const m = mediaMap.get(i.mediaId);
      if (!m) continue;
      out.push({ ...m, caption: i.caption });
    }
    return out;
  } catch (err) {
    console.warn("[content] getProjectGallery failed:", err);
    return [];
  }
}

/* ─────────── Homepage Hero (singleton) ─────────── */

export interface HeroConfig {
  enabled: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  mediaUrl?: string;
  mediaMime?: string;
  posterUrl?: string;
  overlayOpacity: number;
}

export async function getHomepageHero(): Promise<HeroConfig | null> {
  if (!isDbConfigured()) return null;
  try {
    const row = (
      await db.select().from(schema.homepageHero).where(eq(schema.homepageHero.id, "default")).limit(1)
    )[0];
    if (!row || !row.enabled) return null;

    const ids = [row.mediaId, row.posterMediaId].filter((x): x is string => Boolean(x));
    const mediaMap = ids.length > 0 ? await getMediaMetaMap(ids) : new Map<string, MediaMeta>();
    const main = row.mediaId ? mediaMap.get(row.mediaId) : undefined;
    const poster = row.posterMediaId ? mediaMap.get(row.posterMediaId) : undefined;

    return {
      enabled: true,
      eyebrow: row.eyebrow ?? undefined,
      title: row.title ?? undefined,
      subtitle: row.subtitle ?? undefined,
      ctaPrimaryLabel: row.ctaPrimaryLabel ?? undefined,
      ctaPrimaryHref: row.ctaPrimaryHref ?? undefined,
      ctaSecondaryLabel: row.ctaSecondaryLabel ?? undefined,
      ctaSecondaryHref: row.ctaSecondaryHref ?? undefined,
      mediaUrl: main?.url,
      mediaMime: main?.mime,
      posterUrl: poster?.url,
      overlayOpacity: row.overlayOpacity ?? 50,
    };
  } catch (err) {
    console.warn("[content] getHomepageHero failed:", err);
    return null;
  }
}

/* ─────────── Page SEO (per-page overrides for static pages) ─────────── */

export interface PageSeoOverride {
  title?: string;
  description?: string;
  ogImageUrl?: string;
}

export async function getPageSeo(key: string): Promise<PageSeoOverride | null> {
  if (!isDbConfigured()) return null;
  try {
    const row = (
      await db.select().from(schema.pageSeo).where(eq(schema.pageSeo.key, key)).limit(1)
    )[0];
    if (!row) return null;
    let ogImageUrl: string | undefined;
    if (row.ogMediaId) {
      const m = await getMediaMetaMap([row.ogMediaId]);
      ogImageUrl = m.get(row.ogMediaId)?.url;
    }
    return {
      title: row.title || undefined,
      description: row.description || undefined,
      ogImageUrl,
    };
  } catch {
    return null;
  }
}

/* ─────────── Page Hero (per-page hero photo + copy override) ─────────── */

export interface PageHeroOverride {
  enabled: boolean;
  eyebrow?: string;
  title?: string;
  intro?: string;
  imageUrl?: string;
  imageMime?: string;
  imageAlt?: string;
  objectPosition: string;
  opacity: number;
  overlayLeft: number;
}

export async function getPageHero(key: string): Promise<PageHeroOverride | null> {
  if (!isDbConfigured()) return null;
  try {
    const row = (
      await db.select().from(schema.pageHeroes).where(eq(schema.pageHeroes.key, key)).limit(1)
    )[0];
    if (!row) return null;
    if (!row.enabled) return null;
    let imageUrl: string | undefined;
    let imageMime: string | undefined;
    let imageAlt: string | undefined;
    if (row.mediaId) {
      const m = await getMediaMetaMap([row.mediaId]);
      const meta = m.get(row.mediaId);
      imageUrl = meta?.url;
      imageMime = meta?.mime;
      imageAlt = meta?.alt ?? undefined;
    }
    return {
      enabled: row.enabled,
      eyebrow: row.eyebrow || undefined,
      title: row.title || undefined,
      intro: row.intro || undefined,
      imageUrl,
      imageMime,
      imageAlt,
      objectPosition: row.objectPosition,
      opacity: row.opacity,
      overlayLeft: row.overlayLeft,
    };
  } catch {
    return null;
  }
}

/* ─────────── Glossary ─────────── */

export async function getGlossary(): Promise<GlossaryTerm[]> {
  if (!isDbConfigured()) return staticGlossary;
  try {
    const rows = await db
      .select()
      .from(schema.glossaryTerms)
      .where(eq(schema.glossaryTerms.visible, true))
      .orderBy(asc(schema.glossaryTerms.orderIdx), asc(schema.glossaryTerms.term));
    if (rows.length === 0) return staticGlossary;
    return rows.map((r) => ({
      slug: r.slug,
      term: r.term,
      category: r.category,
      shortDef: r.shortDef,
      fullDef: r.fullDef,
      related: r.relatedSlugs ? r.relatedSlugs.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      relatedServices: r.relatedServices
        ? r.relatedServices.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
    }));
  } catch (err) {
    console.warn("[content] getGlossary failed:", err);
    return staticGlossary;
  }
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | undefined> {
  const all = await getGlossary();
  return all.find((t) => t.slug === slug);
}

/* ─────────── Zones ─────────── */

export async function getZones(): Promise<Zone[]> {
  if (!isDbConfigured()) return staticZones;
  try {
    const rows = await db
      .select()
      .from(schema.zones)
      .where(eq(schema.zones.visible, true))
      .orderBy(asc(schema.zones.orderIdx));
    if (rows.length === 0) return staticZones;
    return rows.map((r) => {
      const fallback = staticZones.find((z) => z.slug === r.slug);
      const parseJson = <T>(s: string | null, fb: T): T => {
        if (!s) return fb;
        try {
          return JSON.parse(s) as T;
        } catch {
          return fb;
        }
      };
      return {
        slug: r.slug,
        name: r.name,
        code: r.code,
        region: r.region,
        tagline: r.tagline,
        intro: r.intro,
        cities: r.cities ? r.cities.split(",").map((s) => s.trim()).filter(Boolean) : (fallback?.cities ?? []),
        slaUrgence: r.slaUrgence,
        slaStandard: r.slaStandard,
        hubs: r.hubs ? r.hubs.split(",").map((s) => s.trim()).filter(Boolean) : (fallback?.hubs ?? []),
        kpis: parseJson(r.kpisJson, fallback?.kpis ?? []),
        testimonial: parseJson(r.testimonialJson, fallback?.testimonial),
        faq: parseJson(r.faqJson, fallback?.faq ?? []),
        center: {
          lat: r.centerLat ? Number(r.centerLat) : (fallback?.center.lat ?? 48.8566),
          lng: r.centerLng ? Number(r.centerLng) : (fallback?.center.lng ?? 2.3522),
        },
        seo: {
          title: r.seoTitle || fallback?.seo.title || `${r.name} (${r.code}) — IEF & CO`,
          description: r.seoDescription || fallback?.seo.description || r.tagline,
        },
      };
    });
  } catch (err) {
    console.warn("[content] getZones failed:", err);
    return staticZones;
  }
}

export async function getZoneBySlug(slug: string): Promise<Zone | undefined> {
  const all = await getZones();
  return all.find((z) => z.slug === slug);
}

/* ─────────── Maintenance brands ─────────── */

export async function getBrands(): Promise<Brand[]> {
  if (!isDbConfigured()) return staticBrands;
  try {
    const rows = await db
      .select()
      .from(schema.maintenanceBrands)
      .where(eq(schema.maintenanceBrands.visible, true))
      .orderBy(asc(schema.maintenanceBrands.orderIdx));
    if (rows.length === 0) return staticBrands;
    const parseJson = <T>(s: string | null, fb: T): T => {
      if (!s) return fb;
      try {
        return JSON.parse(s) as T;
      } catch {
        return fb;
      }
    };
    return rows.map((r) => {
      const fallback = staticBrands.find((b) => b.slug === r.slug);
      return {
        slug: r.slug,
        name: r.name,
        tagline: r.tagline,
        intro: r.intro,
        products: parseJson(r.productsJson, fallback?.products ?? []),
        commonFailures: parseJson(r.failuresJson, fallback?.commonFailures ?? []),
        advantages: parseJson(r.strengthsJson, fallback?.advantages ?? []),
        partsInStock: fallback?.partsInStock ?? [],
        faq: parseJson(r.faqJson, fallback?.faq ?? []),
        accentColor: r.accentColor || fallback?.accentColor || "196, 133, 92",
        seo: {
          title: r.seoTitle || fallback?.seo.title || `Maintenance ${r.name} — IEF & CO`,
          description: r.seoDescription || fallback?.seo.description || r.tagline,
        },
      };
    });
  } catch (err) {
    console.warn("[content] getBrands failed:", err);
    return staticBrands;
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const all = await getBrands();
  return all.find((b) => b.slug === slug);
}

/* ─────────── Comparators ─────────── */

export async function getComparators(): Promise<Comparator[]> {
  if (!isDbConfigured()) return staticComparatifs;
  try {
    const rows = await db
      .select()
      .from(schema.comparators)
      .where(eq(schema.comparators.visible, true))
      .orderBy(asc(schema.comparators.orderIdx));
    if (rows.length === 0) return staticComparatifs;

    const ids = rows.map((r) => r.id);
    const allRowsT = await db.select().from(schema.comparatorRows).where(inArray(schema.comparatorRows.comparatorId, ids));
    const allUseCases = await db.select().from(schema.comparatorUseCases).where(inArray(schema.comparatorUseCases.comparatorId, ids));
    const allFaqs = await db.select().from(schema.comparatorFaqs).where(inArray(schema.comparatorFaqs.comparatorId, ids));

    return rows.map((r) => {
      const fallback = staticComparatifs.find((c) => c.slug === r.slug);
      return {
        slug: r.slug,
        title: r.title,
        optionAName: r.optionAName,
        optionBName: r.optionBName,
        tagline: r.tagline,
        intro: r.intro,
        verdict: r.verdict,
        category: r.category as Comparator["category"],
        accent: r.accent,
        rows: allRowsT
          .filter((x) => x.comparatorId === r.id)
          .sort((a, b) => a.orderIdx - b.orderIdx)
          .map((x) => ({ criterion: x.criterion, optionA: x.optionA, optionB: x.optionB, winner: x.winner })),
        useCases: allUseCases
          .filter((x) => x.comparatorId === r.id)
          .sort((a, b) => a.orderIdx - b.orderIdx)
          .map((x) => ({ scenario: x.scenario, recommendation: x.recommendation, reason: x.reason })),
        faq: allFaqs
          .filter((x) => x.comparatorId === r.id)
          .sort((a, b) => a.orderIdx - b.orderIdx)
          .map((x) => ({ question: x.question, answer: x.answer })),
        seo: {
          title: r.seoTitle || fallback?.seo.title || r.title,
          description: r.seoDescription || fallback?.seo.description || r.tagline,
        },
      };
    });
  } catch (err) {
    console.warn("[content] getComparators failed:", err);
    return staticComparatifs;
  }
}

export async function getComparatorBySlug(slug: string): Promise<Comparator | undefined> {
  const all = await getComparators();
  return all.find((c) => c.slug === slug);
}

/* ─────────── Dépannage services ─────────── */

export async function getDepannageServices(): Promise<DepannageService[]> {
  if (!isDbConfigured()) return staticDepannageServices;
  try {
    const rows = await db
      .select()
      .from(schema.depannageServices)
      .where(eq(schema.depannageServices.visible, true))
      .orderBy(asc(schema.depannageServices.orderIdx));
    if (rows.length === 0) return staticDepannageServices;
    const parseJson = <T>(s: string | null, fb: T): T => {
      if (!s) return fb;
      try {
        return JSON.parse(s) as T;
      } catch {
        return fb;
      }
    };
    return rows.map((r) => {
      const fallback = staticDepannageServices.find((d) => d.slug === r.slug);
      return {
        slug: r.slug,
        label: r.label,
        title: fallback?.title || `Dépannage ${r.label} industrielle`,
        tagline: r.tagline,
        intro: r.intro,
        businessImpact: r.businessImpact,
        accentColor: r.accentColor,
        brands: r.brands ? r.brands.split(",").map((s) => s.trim()).filter(Boolean) : (fallback?.brands ?? []),
        commonFailures: parseJson(r.failuresJson, fallback?.commonFailures ?? []),
        partsInStock: r.partsInStock
          ? r.partsInStock.split(",").map((s) => s.trim()).filter(Boolean)
          : (fallback?.partsInStock ?? []),
        relatedServices: r.relatedServices
          ? r.relatedServices.split(",").map((s) => s.trim()).filter(Boolean)
          : (fallback?.relatedServices ?? []),
        seo: {
          title: r.seoTitle || fallback?.seo.title || `Dépannage ${r.label} — IEF & CO`,
          description: r.seoDescription || fallback?.seo.description || r.tagline,
        },
      };
    });
  } catch (err) {
    console.warn("[content] getDepannageServices failed:", err);
    return staticDepannageServices;
  }
}

export async function getDepannageService(slug: string): Promise<DepannageService | undefined> {
  const all = await getDepannageServices();
  return all.find((d) => d.slug === slug);
}

/* ─────────── Company info (settings: site:*) ─────────── */

/**
 * Public-facing company info, structured. Used by the footer, contact page,
 * legal pages, depannage page, JSON-LD LocalBusiness, etc.
 *
 * Sourced from the `settings` table (keys `site:*`) when available, with
 * a static fallback to `src/data/navigation.ts#companyInfo` for any field
 * not yet edited via the admin or when the DB is unavailable.
 */
export interface PublicCompanyInfo {
  /** Display name, e.g. "IEF & CO". */
  name: string;
  /** Legal name, e.g. "IEF AND CO". */
  legalName: string;
  /** Marketing tagline / short description (one-liner). */
  tagline: string;
  /** Tel: link target — full international format, e.g. "+33 1 34 05 87 03". */
  phone: string;
  /** Human-readable phone, e.g. "01 34 05 87 03". */
  phoneDisplay: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
  };
  /** Free-form opening hours (single line), e.g. "Lundi - Vendredi : 8h - 18h". */
  hours: string;
  siren: string;
  naf?: string;
  tvaIntra?: string;
  rcs: string;
  capital?: string;
  president: string;
  founded: number;
  website: string;
  geo: { lat: number; lng: number };
  areaServed: string[];
  social: { linkedin?: string };
}

/**
 * Derives a human-readable phone display from the international `phone`
 * value when `phoneDisplay` isn't explicitly stored. Strips a leading
 * "+33 " and groups by pairs.
 */
function derivePhoneDisplay(phone: string): string {
  const trimmed = phone.trim();
  // Remove "+33 " or "+33" prefix and replace by leading "0"
  const local = trimmed.replace(/^\+33\s?/, "0").replace(/[^0-9]/g, "");
  if (local.length === 10) {
    return local.match(/.{1,2}/g)?.join(" ") ?? trimmed;
  }
  return trimmed;
}

/**
 * Parses an admin-edited address string ("8 Rue René Dubos, 95410 Groslay")
 * into structured parts. Falls back to the static value if parsing fails.
 */
function parseAddress(
  raw: string | null | undefined,
): { street: string; postalCode: string; city: string } | null {
  if (!raw) return null;
  // Match "<street>, <postalCode> <city>" with optional whitespace
  const m = raw.match(/^\s*(.+?),\s*(\d{5})\s+(.+?)\s*$/);
  if (m) {
    return { street: m[1].trim(), postalCode: m[2], city: m[3].trim() };
  }
  // No comma — assume the whole string is the street
  return { street: raw.trim(), postalCode: "", city: "" };
}

const COMPANY_KEYS = [
  "site:name",
  "site:tagline",
  "site:phone",
  "site:phoneDisplay",
  "site:email",
  "site:address",
  "site:hours",
  "site:siren",
  "site:naf",
  "site:tvaIntra",
  "site:rcs",
  "site:capital",
  "site:president",
  "site:legalName",
] as const;

export async function getCompanyInfo(): Promise<PublicCompanyInfo> {
  const fallback: PublicCompanyInfo = {
    name: staticCompanyInfo.name,
    legalName: staticCompanyInfo.fullName,
    tagline: staticCompanyInfo.description,
    phone: staticCompanyInfo.phone,
    phoneDisplay: staticCompanyInfo.phoneDisplay,
    email: staticCompanyInfo.email,
    address: {
      street: staticCompanyInfo.address.street,
      postalCode: staticCompanyInfo.address.postalCode,
      city: staticCompanyInfo.address.city,
      region: staticCompanyInfo.address.region,
      country: staticCompanyInfo.address.country,
    },
    hours: "Lundi - Vendredi : 8h - 18h",
    siren: staticCompanyInfo.siren,
    naf: staticCompanyInfo.naf,
    rcs: staticCompanyInfo.rcs,
    capital: staticCompanyInfo.capital,
    president: staticCompanyInfo.president,
    founded: staticCompanyInfo.founded,
    website: staticCompanyInfo.website,
    geo: staticCompanyInfo.geo,
    areaServed: [...staticCompanyInfo.areaServed],
    social: { ...staticCompanyInfo.social },
  };

  if (!isDbConfigured()) return fallback;

  try {
    const rows = await db
      .select()
      .from(schema.settings)
      .where(inArray(schema.settings.key, [...COMPANY_KEYS]));
    if (rows.length === 0) return fallback;

    const map = new Map<string, string>();
    for (const r of rows) {
      try {
        const parsed = JSON.parse(r.valueJson);
        if (typeof parsed === "string" && parsed.length > 0) {
          map.set(r.key, parsed);
        }
      } catch {
        // ignore malformed rows
      }
    }

    // The admin stores `site:phone` as a human-readable display
    // (e.g. "01 34 05 87 03"). We derive both fields from it unless
    // `site:phoneDisplay` is also explicitly set.
    const rawPhone = map.get("site:phone") || fallback.phoneDisplay;
    const phoneDisplay = map.get("site:phoneDisplay") || rawPhone;
    // International form: ensure leading +33 for tel: links
    const phoneDigits = rawPhone.replace(/[^0-9+]/g, "");
    const phone = phoneDigits.startsWith("+")
      ? phoneDigits
      : phoneDigits.startsWith("0")
        ? `+33 ${phoneDigits.slice(1).replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}`
        : fallback.phone;

    const addressParsed = parseAddress(map.get("site:address"));

    return {
      name: map.get("site:name") || fallback.name,
      legalName: map.get("site:legalName") || fallback.legalName,
      tagline: map.get("site:tagline") || fallback.tagline,
      phone,
      phoneDisplay: map.get("site:phoneDisplay") || derivePhoneDisplay(rawPhone),
      email: map.get("site:email") || fallback.email,
      address: {
        street: addressParsed?.street || fallback.address.street,
        postalCode: addressParsed?.postalCode || fallback.address.postalCode,
        city: addressParsed?.city || fallback.address.city,
        region: fallback.address.region,
        country: fallback.address.country,
      },
      hours: map.get("site:hours") || fallback.hours,
      siren: map.get("site:siren") || fallback.siren,
      naf: map.get("site:naf") || fallback.naf,
      tvaIntra: map.get("site:tvaIntra") || fallback.tvaIntra,
      rcs: map.get("site:rcs") || fallback.rcs,
      capital: map.get("site:capital") || fallback.capital,
      president: map.get("site:president") || fallback.president,
      founded: fallback.founded,
      website: fallback.website,
      geo: fallback.geo,
      areaServed: fallback.areaServed,
      social: fallback.social,
    };
  } catch (err) {
    console.warn("[content] getCompanyInfo failed, falling back to static:", err);
    return fallback;
  }
}

/* ─────────── Branding (logo + favicon, settings: branding:*) ─────────── */

/**
 * Public-facing branding info: logo + favicon URLs resolved from the media
 * library when configured via /admin/settings/branding, with a fallback to
 * static URLs entered as plain text in the same admin page.
 *
 * Used by the Navbar / Footer / login page to render the logo image, and by
 * src/app/icon.tsx to serve the favicon.
 */
export interface PublicBrandingInfo {
  /** Primary logo URL (theme-agnostic — used everywhere). null = render the inline text logo fallback. */
  logoUrl: string | null;
  /** Optional theme-clair-specific logo URL. null = use logoUrl in both themes. */
  logoLightUrl: string | null;
  /** Alt text for the logo image (defaults to "<companyName> — Accueil"). */
  logoAlt: string;
  /** Favicon URL. null = serve the static src/app/favicon.ico. */
  faviconUrl: string | null;
  /** Primary brand color (hex, default #E11021). */
  primaryColor: string;
  /** Copper accent color (hex, default #C4855C). */
  copperColor: string;
}

const BRANDING_KEYS = [
  "brand:primary-color",
  "brand:copper-color",
  "brand:favicon-url",
  "brand:logo-dark-url",
  "brand:logo-light-url",
  "brand:logo-media-id",
  "brand:logo-light-media-id",
  "brand:favicon-media-id",
  "brand:logo-alt",
] as const;

export async function getBranding(): Promise<PublicBrandingInfo> {
  const fallback: PublicBrandingInfo = {
    logoUrl: null,
    logoLightUrl: null,
    logoAlt: `${staticCompanyInfo.name} — Accueil`,
    faviconUrl: null,
    primaryColor: "#E11021",
    copperColor: "#C4855C",
  };

  if (!isDbConfigured()) return fallback;

  try {
    const rows = await db
      .select()
      .from(schema.settings)
      .where(inArray(schema.settings.key, [...BRANDING_KEYS]));
    if (rows.length === 0) return fallback;

    const map = new Map<string, string>();
    for (const r of rows) {
      try {
        const parsed = JSON.parse(r.valueJson);
        if (typeof parsed === "string" && parsed.length > 0) {
          map.set(r.key, parsed);
        }
      } catch {
        // ignore malformed rows
      }
    }

    // Resolve any media-id references to URLs in a single query
    const mediaIds = [
      map.get("brand:logo-media-id"),
      map.get("brand:logo-light-media-id"),
      map.get("brand:favicon-media-id"),
    ].filter((id): id is string => Boolean(id));
    const mediaMap = mediaIds.length > 0 ? await getMediaMetaMap(mediaIds) : new Map<string, MediaMeta>();

    const logoMedia = map.get("brand:logo-media-id")
      ? mediaMap.get(map.get("brand:logo-media-id")!)
      : undefined;
    const logoLightMedia = map.get("brand:logo-light-media-id")
      ? mediaMap.get(map.get("brand:logo-light-media-id")!)
      : undefined;
    const faviconMedia = map.get("brand:favicon-media-id")
      ? mediaMap.get(map.get("brand:favicon-media-id")!)
      : undefined;

    // Priority: media-id (preferred) → URL string (legacy / advanced)
    const logoUrl = logoMedia?.url || map.get("brand:logo-dark-url") || null;
    const logoLightUrl = logoLightMedia?.url || map.get("brand:logo-light-url") || null;
    const faviconUrl = faviconMedia?.url || map.get("brand:favicon-url") || null;
    const logoAlt = map.get("brand:logo-alt") || logoMedia?.alt || `${staticCompanyInfo.name} — Accueil`;

    return {
      logoUrl,
      logoLightUrl,
      logoAlt,
      faviconUrl,
      primaryColor: map.get("brand:primary-color") || fallback.primaryColor,
      copperColor: map.get("brand:copper-color") || fallback.copperColor,
    };
  } catch (err) {
    console.warn("[content] getBranding failed, falling back to defaults:", err);
    return fallback;
  }
}

/* ─────────── Static slugs (for generateStaticParams at build) ─────────── */

export function getStaticServiceSlugs(): string[] {
  return staticServices.map((s) => s.slug);
}

export function getStaticBlogSlugs(): string[] {
  return staticBlogPosts.map((p) => p.slug);
}
