/**
 * Media upload endpoint for the MediaPicker drag-drop / file input.
 *
 * Stores the file via the storage abstraction (Supabase Storage in prod,
 * local /public/uploads in dev) and inserts a row in the media table.
 * Returns the new media id, the public URL and (optionally) probe data.
 */

import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { uploadMedia, detectMimeFromMagicBytes, declaredMimeMatchesMagic } from "@/lib/storage";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIME_PREFIXES = ["image/", "video/"];
const ALLOWED_MIME_EXACT = new Set([
  "application/pdf",
]);

function isAllowedMime(mime: string): boolean {
  if (ALLOWED_MIME_EXACT.has(mime)) return true;
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "Aucun fichier" }, { status: 400 });
    if (file.size <= 0) return NextResponse.json({ ok: false, error: "Fichier vide" }, { status: 400 });
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `Fichier trop volumineux (max ${MAX_BYTES / (1024 * 1024)} MB)` },
        { status: 413 },
      );
    }

    const mime = file.type || "application/octet-stream";
    if (!isAllowedMime(mime)) {
      return NextResponse.json(
        { ok: false, error: `Type non supporté : ${mime}` },
        { status: 415 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Magic-byte validation : refuse files whose declared MIME doesn't match
    // the actual file signature (defends against `.exe` renamed `.jpg`).
    // PDFs and the well-known image/video families are checked. Unknown
    // signatures fall through (we keep the declared MIME but reject if the
    // declared MIME is in a checked family yet the bytes don't confirm).
    const detected = detectMimeFromMagicBytes(bytes);
    if (detected && !declaredMimeMatchesMagic(mime, detected)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Le contenu du fichier (${detected}) ne correspond pas au type déclaré (${mime}).`,
        },
        { status: 415 },
      );
    }
    // For PDF and image/video declared types, require a known signature
    const declaredFamily = mime.startsWith("image/")
      ? "image"
      : mime.startsWith("video/")
        ? "video"
        : mime === "application/pdf"
          ? "pdf"
          : null;
    if (declaredFamily && !detected) {
      return NextResponse.json(
        {
          ok: false,
          error: `Le fichier ne contient pas une signature ${declaredFamily} valide.`,
        },
        { status: 415 },
      );
    }

    // Use the detected MIME when known (more trustworthy than browser-reported)
    const finalMime = detected ?? mime;

    const { url } = await uploadMedia({ bytes, filename: file.name, mime: finalMime });

    const newId = randomBytes(16).toString("hex");
    await db.insert(schema.media).values({
      id: newId,
      filename: file.name,
      url,
      mime: finalMime,
      bytes: file.size,
      uploadedBy: session.user.id,
    });

    return NextResponse.json({ ok: true, mediaId: newId, url, filename: file.name, mime: finalMime });
  } catch (e) {
    console.error("[media upload]", e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
