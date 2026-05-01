/**
 * Convert source images in `public/images/photos/` to optimised WebP and
 * AVIF copies. The .jpg/.png originals are kept as fallbacks (next/image
 * picks the best supported format at request time).
 *
 * Run once after dropping new pictures into the folder :
 *   npx tsx scripts/optimize-images.ts
 *
 * Output is idempotent — re-running won't re-encode files that already
 * have sibling .webp / .avif of the right age.
 */

import { readdir, stat } from "node:fs/promises";
import { resolve, basename, extname, join } from "node:path";
import sharp from "sharp";

const PHOTOS_DIR = resolve(process.cwd(), "public", "images", "photos");

async function listSourceImages(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  return entries
    .filter((name) => /\.(jpg|jpeg|png)$/i.test(name))
    .map((name) => join(dir, name));
}

async function isOlderThan(target: string, source: string): Promise<boolean> {
  try {
    const [t, s] = await Promise.all([stat(target), stat(source)]);
    return t.mtimeMs < s.mtimeMs;
  } catch {
    return true; // target doesn't exist
  }
}

interface Result {
  source: string;
  webpPath: string;
  avifPath: string;
  webpBytes: number;
  avifBytes: number;
  sourceBytes: number;
  skipped: boolean;
}

async function convertOne(source: string): Promise<Result> {
  const ext = extname(source);
  const stem = basename(source, ext);
  const webpPath = join(PHOTOS_DIR, `${stem}.webp`);
  const avifPath = join(PHOTOS_DIR, `${stem}.avif`);

  const sourceStat = await stat(source);
  const sourceBytes = sourceStat.size;

  const [webpStale, avifStale] = await Promise.all([
    isOlderThan(webpPath, source),
    isOlderThan(avifPath, source),
  ]);

  if (!webpStale && !avifStale) {
    const [webpStat, avifStat] = await Promise.all([stat(webpPath), stat(avifPath)]);
    return {
      source,
      webpPath,
      avifPath,
      webpBytes: webpStat.size,
      avifBytes: avifStat.size,
      sourceBytes,
      skipped: true,
    };
  }

  const pipeline = sharp(source).rotate(); // honour EXIF orientation

  if (webpStale) {
    await pipeline.clone().webp({ quality: 82, effort: 5 }).toFile(webpPath);
  }
  if (avifStale) {
    await pipeline.clone().avif({ quality: 60, effort: 5 }).toFile(avifPath);
  }

  const [webpStat, avifStat] = await Promise.all([stat(webpPath), stat(avifPath)]);
  return {
    source,
    webpPath,
    avifPath,
    webpBytes: webpStat.size,
    avifBytes: avifStat.size,
    sourceBytes,
    skipped: false,
  };
}

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  console.log(`📷 Optimising images in ${PHOTOS_DIR}`);
  const sources = await listSourceImages(PHOTOS_DIR);
  if (sources.length === 0) {
    console.log("   nothing to do (no .jpg / .png found)");
    return;
  }

  let totalSource = 0;
  let totalWebp = 0;
  let totalAvif = 0;
  let processed = 0;
  let skipped = 0;

  for (const src of sources) {
    const r = await convertOne(src);
    totalSource += r.sourceBytes;
    totalWebp += r.webpBytes;
    totalAvif += r.avifBytes;
    if (r.skipped) {
      skipped++;
    } else {
      processed++;
      const savingsW = ((1 - r.webpBytes / r.sourceBytes) * 100).toFixed(0);
      const savingsA = ((1 - r.avifBytes / r.sourceBytes) * 100).toFixed(0);
      console.log(
        `   ✓ ${basename(src)} ${fmt(r.sourceBytes)} → ${fmt(r.webpBytes)} webp (-${savingsW}%) · ${fmt(r.avifBytes)} avif (-${savingsA}%)`,
      );
    }
  }

  console.log(
    `\n📊 ${processed} encoded, ${skipped} skipped (already up-to-date)`,
  );
  console.log(
    `   Original total : ${fmt(totalSource)}  ·  WebP : ${fmt(totalWebp)} (-${(((1 - totalWebp / totalSource) * 100) | 0)}%)  ·  AVIF : ${fmt(totalAvif)} (-${(((1 - totalAvif / totalSource) * 100) | 0)}%)`,
  );
  console.log("\n   next/image picks AVIF then WebP then the original — no path change required in components.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
