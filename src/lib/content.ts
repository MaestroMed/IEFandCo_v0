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
import { db, schema } from "@/db";
import { eq, asc, desc } from "drizzle-orm";

import { services as staticServices, type Service } from "@/data/services";
import { testimonials as staticTestimonials, type Testimonial } from "@/data/testimonials";
import { clients as staticClients, type Client } from "@/data/clients";
import { homepageFAQ as staticHomepageFAQ, type FAQItem } from "@/data/faq";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/data/blog";
import { realisations as staticRealisations, type Realisation } from "@/data/realisations";

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

/* ─────────── Services ─────────── */

export async function getServices(): Promise<Service[]> {
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
  try {
    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.visible, true))
      .orderBy(asc(schema.testimonials.orderIdx));

    if (rows.length === 0) return staticTestimonials;

    return rows.map((r, i) => ({
      id: i + 1,
      name: r.author,
      company: r.company || "",
      text: r.quote,
      rating: r.rating || 5,
    }));
  } catch (err) {
    console.warn("[content] getTestimonials failed, falling back to static:", err);
    return staticTestimonials;
  }
}

/* ─────────── Clients ─────────── */

export async function getClients(): Promise<Client[]> {
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
  try {
    const rows = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.status, "published"))
      .orderBy(desc(schema.blogPosts.publishedAt));

    if (rows.length === 0) return staticBlogPosts;

    return rows.map((r) => {
      const fallback = staticBlogPosts.find((p) => p.slug === r.slug);
      const date = r.publishedAt || new Date();
      const html = r.contentHtml || "";
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
  try {
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.status, "published"))
      .orderBy(asc(schema.projects.orderIdx), desc(schema.projects.createdAt));

    if (rows.length === 0) return staticRealisations;

    return rows.map((r) => {
      const fallback = staticRealisations.find((p) => p.slug === r.slug);
      return {
        slug: r.slug,
        title: r.title,
        category: (r.category as Realisation["category"]) || "structures",
        client: r.clientName || fallback?.client || "—",
        year: r.year || fallback?.year || new Date().getFullYear(),
        location: r.location || fallback?.location || "Île-de-France",
        description: r.description || fallback?.description || "",
        highlight: r.highlight || fallback?.highlight || "",
      };
    });
  } catch (err) {
    console.warn("[content] getRealisations failed, falling back to static:", err);
    return staticRealisations;
  }
}

/* ─────────── Static slugs (for generateStaticParams at build) ─────────── */

export function getStaticServiceSlugs(): string[] {
  return staticServices.map((s) => s.slug);
}

export function getStaticBlogSlugs(): string[] {
  return staticBlogPosts.map((p) => p.slug);
}
