"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import path from "node:path";
import fs from "node:fs/promises";

function id() {
  return randomBytes(16).toString("hex");
}

function safeFilename(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function uploadMedia(formData: FormData) {
  const user = await requireAdmin();
  try {
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string | null) || null;
    if (!file) return { ok: false as const, error: "Aucun fichier" };
    if (file.size <= 0) return { ok: false as const, error: "Fichier vide" };

    const bytes = Buffer.from(await file.arrayBuffer());
    const ts = Date.now();
    const filename = `${ts}-${safeFilename(file.name)}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const diskPath = path.join(uploadsDir, filename);
    await fs.writeFile(diskPath, bytes);

    const url = `/uploads/${filename}`;
    const newId = id();
    await db.insert(schema.media).values({
      id: newId,
      filename,
      url,
      mime: file.type || "application/octet-stream",
      bytes: file.size,
      alt,
      uploadedBy: user.id,
    });

    revalidatePath("/admin/media");
    return { ok: true as const, id: newId, url };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteMedia(mediaId: string) {
  await requireAdmin();
  try {
    const rows = await db.select().from(schema.media).where(eq(schema.media.id, mediaId)).limit(1);
    if (rows.length === 0) return { ok: false as const, error: "Introuvable" };
    const m = rows[0];
    // Try to unlink local file if stored under /uploads
    if (m.url?.startsWith("/uploads/")) {
      try {
        await fs.unlink(path.join(process.cwd(), "public", m.url));
      } catch {
        /* ignore if already missing */
      }
    }
    await db.delete(schema.media).where(eq(schema.media.id, mediaId));
    revalidatePath("/admin/media");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateMediaAlt(mediaId: string, alt: string) {
  await requireAdmin();
  try {
    await db.update(schema.media).set({ alt: alt || null }).where(eq(schema.media.id, mediaId));
    revalidatePath("/admin/media");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
