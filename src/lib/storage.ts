/**
 * Media storage abstraction.
 *
 * Production : Supabase Storage (bucket "media", public read).
 *   Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + SUPABASE_STORAGE_BUCKET (defaults to "media").
 *
 * Development fallback : local /public/uploads (zero config, dev-only).
 *   Used when SUPABASE_URL is not set. Files written here are not persisted in
 *   prod (Vercel /public is read-only) — Supabase env vars must be set for prod.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import path from "node:path";
import fs from "node:fs/promises";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "media";

let _client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export interface UploadResult {
  url: string;
  storage: "supabase" | "local";
  storagePath: string;
}

export function safeFilename(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function uploadMedia({
  bytes,
  filename,
  mime,
}: {
  bytes: Buffer;
  filename: string;
  mime: string;
}): Promise<UploadResult> {
  const sb = getSupabase();
  const ts = Date.now();
  const safe = safeFilename(filename);
  const objectPath = `${ts}-${safe}`;

  if (sb) {
    const { error } = await sb.storage.from(BUCKET).upload(objectPath, bytes, {
      contentType: mime,
      upsert: false,
    });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const {
      data: { publicUrl },
    } = sb.storage.from(BUCKET).getPublicUrl(objectPath);
    return { url: publicUrl, storage: "supabase", storagePath: objectPath };
  }

  // Local dev fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const diskPath = path.join(uploadsDir, objectPath);
  await fs.writeFile(diskPath, bytes);
  return { url: `/uploads/${objectPath}`, storage: "local", storagePath: objectPath };
}

export async function deleteMedia(storagePath: string, storage: "supabase" | "local"): Promise<void> {
  if (storage === "supabase") {
    const sb = getSupabase();
    if (!sb) return;
    await sb.storage.from(BUCKET).remove([storagePath]);
    return;
  }
  const diskPath = path.join(process.cwd(), "public", "uploads", storagePath);
  try {
    await fs.unlink(diskPath);
  } catch {
    /* ignore */
  }
}

export function isStorageConfigured(): boolean {
  return !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
