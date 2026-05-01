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
let _bootChecked = false;

function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

/** Throws in production if Supabase Storage is not configured — uploads to
 *  /public/uploads silently break on Vercel (read-only filesystem) so we'd
 *  rather fail fast at the first upload than lose data silently. */
function assertStorageConfiguredInProd(): void {
  if (_bootChecked) return;
  _bootChecked = true;
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    throw new Error(
      "Storage non configuré : SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY sont requis en production. " +
        "Le fallback /public/uploads ne fonctionne pas sur Vercel (filesystem en lecture seule).",
    );
  }
}

/* ─────────── Magic-bytes detection (defends against MIME spoofing) ─────────── */

/**
 * Reads the first ~16 bytes of a buffer and infers the real MIME type from
 * the file signature. Returns `null` if no known signature matches — the
 * caller can choose to allow or reject untyped uploads.
 *
 * Covers the formats accepted by the BO : JPEG, PNG, GIF, WebP, AVIF, MP4,
 * WebM, MOV (QuickTime), PDF.
 */
export function detectMimeFromMagicBytes(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  // JPEG : FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  // GIF : 47 49 46 38 (GIF8)
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WebP / AVIF : RIFF....WEBP or ftyp....avif
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "image/webp";
  }
  // MP4 / QuickTime / AVIF : `ftyp` at offset 4, brand at offset 8
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = buf.toString("ascii", 8, 12);
    if (brand === "qt  ") return "video/quicktime";
    if (brand === "avif" || brand === "avis") return "image/avif";
    return "video/mp4"; // default for ftyp box (mp4, m4a, isom...)
  }
  // WebM / Matroska : 1A 45 DF A3
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return "video/webm";
  // PDF : %PDF
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
    return "application/pdf";
  }
  return null;
}

/** Returns true if the declared MIME family matches the detected magic-byte
 *  type (e.g. user claims `image/jpeg` and the bytes start with `FF D8 FF`). */
export function declaredMimeMatchesMagic(declared: string, detected: string | null): boolean {
  if (!detected) return false;
  if (declared === detected) return true;
  // image/* and video/* families : accept any sub-type within the family
  if (declared.startsWith("image/") && detected.startsWith("image/")) return true;
  if (declared.startsWith("video/") && detected.startsWith("video/")) return true;
  return false;
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
  assertStorageConfiguredInProd();
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
