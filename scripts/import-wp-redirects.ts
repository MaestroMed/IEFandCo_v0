/**
 * Import 301 redirects from the old WordPress site into the `redirects` table.
 *
 * The middleware (src/middleware.ts) reads this table and emits 301s in real
 * time — no redeploy needed when redirects change.
 *
 * Usage :
 *   npx tsx scripts/import-wp-redirects.ts ./redirects.csv
 *
 * CSV format (no header) :
 *   /old/path,/new/path
 *   /old/path,/new/path,302         (optional 3rd column overrides 301)
 *   /blog/post-2024,/blog/new-post
 *
 * Notes :
 *   - Lines starting with `#` are ignored (comments).
 *   - Existing rows with the same `from_path` are UPDATED (idempotent).
 *   - Run on prod by exporting the prod DATABASE_URL before running.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { db, schema } from "../src/db";
import { sql } from "drizzle-orm";

interface Row {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

function cuid() {
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

function parseCsv(content: string): Row[] {
  const rows: Row[] = [];
  let lineNum = 0;
  for (const raw of content.split(/\r?\n/)) {
    lineNum++;
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(",").map((s) => s.trim());
    if (parts.length < 2) {
      console.warn(`  ⚠ line ${lineNum} skipped (need at least from,to): "${line}"`);
      continue;
    }
    const [fromPath, toPath, statusRaw] = parts;
    if (!fromPath.startsWith("/")) {
      console.warn(`  ⚠ line ${lineNum} skipped (from must start with /): "${fromPath}"`);
      continue;
    }
    if (!toPath) {
      console.warn(`  ⚠ line ${lineNum} skipped (empty to)`);
      continue;
    }
    const statusCode = statusRaw ? Number(statusRaw) : 301;
    if (!Number.isFinite(statusCode) || statusCode < 300 || statusCode > 399) {
      console.warn(`  ⚠ line ${lineNum} skipped (invalid status ${statusRaw})`);
      continue;
    }
    rows.push({ fromPath, toPath, statusCode });
  }
  return rows;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: npx tsx scripts/import-wp-redirects.ts <path-to-csv>");
    process.exit(1);
  }
  const csvPath = resolve(process.cwd(), arg);
  if (!existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Export it before running.");
    process.exit(1);
  }

  console.log(`📥 Reading ${csvPath}...`);
  const content = readFileSync(csvPath, "utf8");
  const rows = parseCsv(content);
  console.log(`   ${rows.length} redirects parsed.`);

  let inserted = 0;
  for (const r of rows) {
    const result = await db
      .insert(schema.redirects)
      .values({
        id: cuid(),
        fromPath: r.fromPath,
        toPath: r.toPath,
        statusCode: r.statusCode,
      })
      .onConflictDoUpdate({
        target: schema.redirects.fromPath,
        set: { toPath: r.toPath, statusCode: r.statusCode },
      })
      .returning({ id: schema.redirects.id });
    if (result[0]) {
      // We can't easily distinguish insert vs update from RETURNING,
      // so we count both as "applied" — the conflict path means update.
      // For a precise count, query before/after; not worth it here.
      inserted++;
    }
  }

  // Stats : how many redirects in total now ?
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(schema.redirects);

  console.log(`✅ Applied ${inserted} redirects (insert or update).`);
  console.log(`   Total redirects in DB : ${total}`);
  console.log(`   Test : curl -I https://iefandco.com<a from_path> → expect ${rows[0]?.statusCode ?? 301}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
