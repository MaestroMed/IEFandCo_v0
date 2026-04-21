/**
 * SEO overrides for static pages.
 *
 * Stores arbitrary title/description per page key in the `settings` table
 * with the convention key = `seo:<page-key>`.
 * Public pages may read from this with `getSeoOverride()` and fall back to
 * their hardcoded metadata.
 */

import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export type SeoOverride = { title?: string; description?: string };

export async function getSeoOverride(key: string): Promise<SeoOverride | null> {
  const row = (
    await db.select().from(schema.settings).where(eq(schema.settings.key, `seo:${key}`)).limit(1)
  )[0];
  if (!row) return null;
  try {
    return JSON.parse(row.valueJson) as SeoOverride;
  } catch {
    return null;
  }
}

export async function setSeoOverride(key: string, value: SeoOverride): Promise<void> {
  const fullKey = `seo:${key}`;
  const existing = (
    await db.select().from(schema.settings).where(eq(schema.settings.key, fullKey)).limit(1)
  )[0];
  if (existing) {
    await db
      .update(schema.settings)
      .set({ valueJson: JSON.stringify(value), updatedAt: new Date() })
      .where(eq(schema.settings.key, fullKey));
  } else {
    await db.insert(schema.settings).values({ key: fullKey, valueJson: JSON.stringify(value) });
  }
}
