/**
 * Slug → photo path mappings for content sections.
 *
 * Photos live in /public/images/photos/ — sourced from Unsplash (free for
 * commercial use, no attribution required). Each map provides a sensible
 * default fallback when a slug isn't explicitly mapped.
 */

const PHOTO_BASE = "/images/photos";

/* ─────── Realisations (project gallery) ─────── */
const realisationDefaults: Record<string, string> = {
  "charpente-logistique-roissy": `${PHOTO_BASE}/realisation-construction.jpg`,
  "portail-autoporte-eg-group": `${PHOTO_BASE}/realisation-portail-noir.jpg`,
  "porte-sectionnelle-eni": `${PHOTO_BASE}/service-industrielles.jpg`,
  "mezzanine-industrielle-htds": `${PHOTO_BASE}/realisation-industrial.jpg`,
  "garde-corps-verre-westfield": `${PHOTO_BASE}/service-menuiserie.jpg`,
  "maintenance-renovation-lidl": `${PHOTO_BASE}/realisation-welding-team.jpg`,
};

const realisationCategoryFallback: Record<string, string> = {
  structures: `${PHOTO_BASE}/service-structures.jpg`,
  portails: `${PHOTO_BASE}/service-portails.jpg`,
  industrielles: `${PHOTO_BASE}/service-industrielles.jpg`,
  menuiserie: `${PHOTO_BASE}/service-menuiserie.jpg`,
  "coupe-feu": `${PHOTO_BASE}/service-coupe-feu.jpg`,
  automatismes: `${PHOTO_BASE}/realisation-portail-noir.jpg`,
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
  automatismes: `${PHOTO_BASE}/realisation-portail-noir.jpg`,
  maintenance: `${PHOTO_BASE}/service-maintenance.jpg`,
};

export function getServicePhoto(slug: string): string {
  return servicePhotos[slug] || `${PHOTO_BASE}/service-structures.jpg`;
}

/* ─────── Blog ─────── */
const blogCategoryPhotos: Record<string, string> = {
  Guide: `${PHOTO_BASE}/blog-case-study.jpg`,
  Normes: `${PHOTO_BASE}/realisation-industrial.jpg`,
  Technique: `${PHOTO_BASE}/blog-technique.jpg`,
  "Case Study": `${PHOTO_BASE}/service-structures.jpg`,
};

export function getBlogPhoto(category: string): string {
  return blogCategoryPhotos[category] || `${PHOTO_BASE}/service-structures.jpg`;
}

/* ─────── Atmosphere photos (fixed slots) ─────── */
export const ATMOSPHERE = {
  hero: `${PHOTO_BASE}/hero-welder-dark.jpg`,
  cta: `${PHOTO_BASE}/cta-welder-room.jpg`,
  about: `${PHOTO_BASE}/about-welder-sunset.jpg`,
  textureRebar: `${PHOTO_BASE}/texture-rebar.jpg`,
} as const;
