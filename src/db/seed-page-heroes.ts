/**
 * Seed page_heroes : creates 13 default rows + imports the static
 * /public/images/photos/* into the `media` table so they appear in the
 * MediaPicker. The page_heroes rows start with mediaId=null which means
 * "use the static fallback baked into the page". Once the admin uploads
 * a new image and saves, mediaId starts pointing to a media row and the
 * BO override takes effect on the public page.
 *
 * Idempotent : skips rows that already exist.
 *
 *   npx tsx src/db/seed-page-heroes.ts
 */

import { db } from "./index";
import { pageHeroes, media } from "./schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const PHOTOS_DIR = resolve(process.cwd(), "public", "images", "photos");

function cuid(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Page heroes seed list.
 * Order = how it appears in the admin list (logical user navigation order).
 */
interface HeroSeed {
  key: string;
  filename: string;
  /** Pre-calibrated overlay opacity (background sections sit lower than heroes). */
  opacity?: number;
  overlayLeft?: number;
}

const HEROES: HeroSeed[] = [
  // Page heroes (full-bleed photo behind copy)
  { key: "a-propos", filename: "about-welder-sunset.jpg" },
  { key: "services-index", filename: "hero-services.jpg" },
  { key: "realisations-index", filename: "hero-realisations.jpg" },
  { key: "blog-index", filename: "hero-blog.jpg" },
  { key: "contact", filename: "hero-contact.jpg" },
  { key: "devis", filename: "hero-devis.jpg" },
  { key: "assisteo", filename: "hero-assisteo.jpg" },
  { key: "estimateur", filename: "hero-estimateur.jpg" },
  { key: "maintenance-contrats", filename: "hero-maintenance-contrats.jpg" },
  { key: "comparatifs-index", filename: "hero-comparatifs.jpg" },
  { key: "depannage-index", filename: "hero-depannage.jpg" },
  { key: "glossaire-index", filename: "hero-glossaire.jpg" },
  { key: "zones-intervention", filename: "hero-zones.jpg" },
  // Homepage section backgrounds (lower opacity — content sits centered on top)
  { key: "home-stats", filename: "section-stats.jpg", opacity: 45, overlayLeft: 70 },
  { key: "home-testimonials", filename: "section-testimonials.jpg", opacity: 35, overlayLeft: 70 },
  { key: "home-cta", filename: "section-cta.jpg", opacity: 60, overlayLeft: 70 },
];

async function seedMediaForPhoto(filename: string): Promise<string | null> {
  // Returns media id (existing or new) for /images/photos/{filename}.
  const url = `/images/photos/${filename}`;

  // Check if a media row already references this URL.
  const existing = await db.select().from(media).where(eq(media.url, url)).limit(1);
  if (existing[0]) return existing[0].id;

  // Probe disk for filesize. If the file is missing on disk, skip — the row
  // would point to a 404. Devs running this against a fresh checkout might
  // not have the photos cached yet.
  let bytes = 0;
  try {
    const s = await stat(resolve(PHOTOS_DIR, filename));
    bytes = s.size;
  } catch {
    console.warn(`   ⚠ ${filename} not found on disk — skipping media import`);
    return null;
  }

  const id = cuid();
  await db.insert(media).values({
    id,
    filename,
    url,
    mime: "image/jpeg",
    bytes,
    alt: filename.replace(/\.[a-z]+$/i, "").replace(/[-_]/g, " "),
  });
  console.log(`   ✓ Imported /images/photos/${filename} into media (id=${id.slice(0, 8)})`);
  return id;
}

async function main() {
  console.log("🌱 Seeding page_heroes + importing static photos into media...");

  let created = 0;
  let skipped = 0;

  for (const hero of HEROES) {
    const existing = await db.select().from(pageHeroes).where(eq(pageHeroes.key, hero.key)).limit(1);
    if (existing[0]) {
      skipped++;
      continue;
    }

    // Make sure the static photo has a media row, even though mediaId stays
    // null on the hero — having the row in `media` lets the admin pick it
    // back up via MediaPicker without re-uploading.
    await seedMediaForPhoto(hero.filename);

    await db.insert(pageHeroes).values({
      key: hero.key,
      enabled: true,
      objectPosition: "center 50%",
      opacity: hero.opacity ?? 100,
      overlayLeft: hero.overlayLeft ?? 70,
      // mediaId stays null so the page falls back to the static image baked
      // into the public page component. The admin can pick a new media via
      // /admin/site/heroes/[key] to start serving the override.
      mediaId: null,
    });
    created++;
    console.log(`   ✓ Created default hero row for "${hero.key}"`);
  }

  console.log(`\n📊 ${created} created, ${skipped} skipped (already existed)`);
  console.log(`   Admin list available at /admin/site/heroes`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
