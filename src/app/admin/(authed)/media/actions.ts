"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import {
  uploadMedia as storageUploadMedia,
  detectMimeFromMagicBytes,
  declaredMimeMatchesMagic,
} from "@/lib/storage";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

function id() {
  return randomBytes(16).toString("hex");
}

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME_PREFIXES = ["image/", "video/"];
const ALLOWED_MIME_EXACT = new Set(["application/pdf"]);

function isAllowedMime(mime: string): boolean {
  if (ALLOWED_MIME_EXACT.has(mime)) return true;
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
}

export async function uploadMedia(formData: FormData) {
  const user = await requireAdmin();
  try {
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string | null) || null;
    if (!file) return { ok: false as const, error: "Aucun fichier" };
    if (file.size <= 0) return { ok: false as const, error: "Fichier vide" };
    if (file.size > MAX_BYTES) {
      return {
        ok: false as const,
        error: `Fichier trop volumineux (max ${MAX_BYTES / (1024 * 1024)} MB)`,
      };
    }

    const declaredMime = file.type || "application/octet-stream";
    if (!isAllowedMime(declaredMime)) {
      return { ok: false as const, error: `Type non supporté : ${declaredMime}` };
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Magic-byte validation: defends against MIME spoofing.
    const detected = detectMimeFromMagicBytes(bytes);
    if (detected && !declaredMimeMatchesMagic(declaredMime, detected)) {
      return {
        ok: false as const,
        error: `Le contenu du fichier (${detected}) ne correspond pas au type déclaré (${declaredMime}).`,
      };
    }
    const declaredFamily = declaredMime.startsWith("image/")
      ? "image"
      : declaredMime.startsWith("video/")
        ? "video"
        : declaredMime === "application/pdf"
          ? "pdf"
          : null;
    if (declaredFamily && !detected) {
      return {
        ok: false as const,
        error: `Le fichier ne contient pas une signature ${declaredFamily} valide.`,
      };
    }

    // Use the detected MIME when known (more trustworthy than browser-reported).
    const finalMime = detected ?? declaredMime;

    const { url } = await storageUploadMedia({ bytes, filename: file.name, mime: finalMime });

    const newId = id();
    await db.insert(schema.media).values({
      id: newId,
      filename: file.name,
      url,
      mime: finalMime,
      bytes: file.size,
      alt,
      uploadedBy: user.id,
    });

    await logAudit({
      userId: user.id,
      entity: "media",
      entityId: newId,
      action: "create",
      diff: { filename: file.name, mime: finalMime, bytes: file.size },
    });

    revalidatePath("/admin/media");
    return { ok: true as const, id: newId, url };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteMedia(mediaId: string) {
  const user = await requireAdmin();
  try {
    const rows = await db.select().from(schema.media).where(eq(schema.media.id, mediaId)).limit(1);
    if (rows.length === 0) return { ok: false as const, error: "Introuvable" };
    const m = rows[0];
    await db.delete(schema.media).where(eq(schema.media.id, mediaId));

    await logAudit({
      userId: user.id,
      entity: "media",
      entityId: mediaId,
      action: "delete",
      diff: { filename: m.filename, url: m.url },
    });

    revalidatePath("/admin/media");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateMediaAlt(mediaId: string, alt: string) {
  const user = await requireAdmin();
  try {
    await db.update(schema.media).set({ alt: alt || null }).where(eq(schema.media.id, mediaId));
    await logAudit({
      userId: user.id,
      entity: "media",
      entityId: mediaId,
      action: "update",
      diff: { alt },
    });
    revalidatePath("/admin/media");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
