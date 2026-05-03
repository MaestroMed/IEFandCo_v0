/**
 * Slug → photo path mappings for content sections.
 *
 * **FALLBACK ONLY** — used when no `coverMediaId` has been uploaded for the
 * entity from the BO. The order of precedence in public components :
 *
 *   1. `entity.coverUrl` (DB) — uploaded via /admin/{services,projects,blog}/[id]
 *      → served from Supabase Storage in prod, /public/uploads in dev
 *   2. `getServicePhoto(slug)` / `getRealisationPhoto(slug, category)` /
 *      `getBlogPhoto(category)` — these static defaults below
 *
 * Don't add new mappings here — upload via the BO instead. Once every
 * entity has a `coverMediaId` set, this file can be deleted (the helper
 * functions can be no-ops returning empty strings, components already
 * gracefully handle that via `coverUrl || photoMapFallback`).
 *
 * Photos live in /public/images/photos/ — generated via GPT Image 2 (May 2026)
 * on the IEF & CO "Forged Light" preset. Each map provides a sensible
 * default fallback when a slug isn't explicitly mapped.
 */

const PHOTO_BASE = "/images/photos";

/* ─────── Realisations (project gallery) ─────── */
const realisationDefaults: Record<string, string> = {
  "charpente-logistique-roissy": `${PHOTO_BASE}/realisation-construction.jpg`,
  "portail-autoporte-eg-group": `${PHOTO_BASE}/realisation-portail-noir.jpg`,
  "porte-sectionnelle-eni": `${PHOTO_BASE}/realisation-porte-eni.jpg`,
  "mezzanine-industrielle-htds": `${PHOTO_BASE}/realisation-industrial.jpg`,
  "garde-corps-verre-westfield": `${PHOTO_BASE}/realisation-garde-corps-defense.jpg`,
  "garde-corps-tertiaire-defense": `${PHOTO_BASE}/realisation-garde-corps-defense.jpg`,
  "maintenance-renovation-lidl": `${PHOTO_BASE}/realisation-welding-team.jpg`,
  "porte-coupe-feu-erp": `${PHOTO_BASE}/realisation-porte-coupe-feu-erp.jpg`,
};

const realisationCategoryFallback: Record<string, string> = {
  structures: `${PHOTO_BASE}/service-structures.jpg`,
  portails: `${PHOTO_BASE}/service-portails.jpg`,
  industrielles: `${PHOTO_BASE}/service-industrielles.jpg`,
  menuiserie: `${PHOTO_BASE}/service-menuiserie.jpg`,
  "coupe-feu": `${PHOTO_BASE}/realisation-porte-coupe-feu-erp.jpg`,
  automatismes: `${PHOTO_BASE}/service-automatismes.jpg`,
  maintenance: `${PHOTO_BASE}/service-maintenance.jpg`,
};

export function getRealisationPhoto(slug: string, category?: string): string {
  return (
    realisationDefaults[slug] ||
    (category ? realisationCategoryFallback[category] : undefined) ||
    `${PHOTO_BASE}/realisation-construction.jpg`
  );
}

/* ─────── Services ─────── */
const servicePhotos: Record<string, string> = {
  "fermetures-industrielles": `${PHOTO_BASE}/service-industrielles.jpg`,
  "portails-clotures": `${PHOTO_BASE}/service-portails.jpg`,
  "structures-metalliques": `${PHOTO_BASE}/service-structures.jpg`,
  "menuiserie-vitrerie": `${PHOTO_BASE}/service-menuiserie.jpg`,
  "portes-coupe-feu": `${PHOTO_BASE}/service-coupe-feu.jpg`,
  automatismes: `${PHOTO_BASE}/service-automatismes.jpg`,
  maintenance: `${PHOTO_BASE}/service-maintenance.jpg`,
};

export function getServicePhoto(slug: string): string {
  return servicePhotos[slug] || `${PHOTO_BASE}/service-structures.jpg`;
}

/* ─────── Blog ─────── */
const blogCategoryPhotos: Record<string, string> = {
  Guide: `${PHOTO_BASE}/blog-guide.jpg`,
  Normes: `${PHOTO_BASE}/blog-normes.jpg`,
  Technique: `${PHOTO_BASE}/blog-technique.jpg`,
  "Case Study": `${PHOTO_BASE}/blog-case-study.jpg`,
};

export function getBlogPhoto(category: string): string {
  return blogCategoryPhotos[category] || `${PHOTO_BASE}/blog-guide.jpg`;
}

/* ─────── Atmosphere photos (fixed slots) ─────── */
export const ATMOSPHERE = {
  hero: `${PHOTO_BASE}/hero-welder-dark.jpg`,
  cta: `${PHOTO_BASE}/cta-welder-room.jpg`,
  about: `${PHOTO_BASE}/about-welder-sunset.jpg`,
  textureRebar: `${PHOTO_BASE}/texture-rebar.jpg`,
  ogDefault: `${PHOTO_BASE}/og-default.jpg`,
  heroAssisteo: `${PHOTO_BASE}/hero-assisteo.jpg`,
  heroEstimateur: `${PHOTO_BASE}/hero-estimateur.jpg`,
  heroMaintenanceContrats: `${PHOTO_BASE}/hero-maintenance-contrats.jpg`,
  // V2 batch (May 2 PM) — public-page heros
  heroRealisations: `${PHOTO_BASE}/hero-realisations.jpg`,
  heroBlog: `${PHOTO_BASE}/hero-blog.jpg`,
  heroContact: `${PHOTO_BASE}/hero-contact.jpg`,
  heroComparatifs: `${PHOTO_BASE}/hero-comparatifs.jpg`,
  heroGlossaire: `${PHOTO_BASE}/hero-glossaire.jpg`,
  heroZones: `${PHOTO_BASE}/hero-zones.jpg`,
  // V3 batch (May 3) — completes the public-page coverage
  heroServices: `${PHOTO_BASE}/hero-services.jpg`,
  heroDevis: `${PHOTO_BASE}/hero-devis.jpg`,
  heroDepannage: `${PHOTO_BASE}/hero-depannage.jpg`,
  // Homepage section backgrounds
  sectionStats: `${PHOTO_BASE}/section-stats.jpg`,
  sectionTestimonials: `${PHOTO_BASE}/section-testimonials.jpg`,
  sectionCta: `${PHOTO_BASE}/section-cta.jpg`,
} as const;
