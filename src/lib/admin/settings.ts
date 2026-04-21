/**
 * Generic settings store backed by the `settings` table.
 *
 * Values are stored as JSON strings and parsed on read.
 * `getMany` and `setMany` are convenience helpers for forms that touch
 * a known set of keys at once.
 */

import { db, schema } from "@/db";
import { eq, inArray } from "drizzle-orm";

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const row = (
    await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1)
  )[0];
  if (!row) return null;
  try {
    return JSON.parse(row.valueJson) as T;
  } catch {
    return null;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const existing = (
    await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1)
  )[0];
  if (existing) {
    await db
      .update(schema.settings)
      .set({ valueJson: JSON.stringify(value), updatedAt: new Date() })
      .where(eq(schema.settings.key, key));
  } else {
    await db.insert(schema.settings).values({ key, valueJson: JSON.stringify(value) });
  }
}

export async function getMany(keys: string[]): Promise<Record<string, unknown>> {
  if (keys.length === 0) return {};
  const rows = await db.select().from(schema.settings).where(inArray(schema.settings.key, keys));
  const out: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      out[r.key] = JSON.parse(r.valueJson);
    } catch {
      out[r.key] = null;
    }
  }
  return out;
}

export async function setMany(values: Record<string, unknown>): Promise<void> {
  const keys = Object.keys(values);
  if (keys.length === 0) return;
  const existing = await db
    .select({ key: schema.settings.key })
    .from(schema.settings)
    .where(inArray(schema.settings.key, keys));
  const existingSet = new Set(existing.map((r) => r.key));

  for (const k of keys) {
    if (existingSet.has(k)) {
      await db
        .update(schema.settings)
        .set({ valueJson: JSON.stringify(values[k]), updatedAt: new Date() })
        .where(eq(schema.settings.key, k));
    } else {
      await db.insert(schema.settings).values({ key: k, valueJson: JSON.stringify(values[k]) });
    }
  }
}

export async function deleteSetting(key: string): Promise<void> {
  await db.delete(schema.settings).where(eq(schema.settings.key, key));
}
