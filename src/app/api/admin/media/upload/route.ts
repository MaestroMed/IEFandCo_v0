/**
 * Media upload endpoint for the MediaPicker drag-drop / file input.
 *
 * Saves the file under public/uploads/{timestamp}-{safe-filename} and inserts
 * a row into the media table. Returns the new media id and url.
 */

import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { randomBytes } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function safeFilename(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "Aucun fichier" }, { status: 400 });
    if (file.size <= 0) return NextResponse.json({ ok: false, error: "Fichier vide" }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const ts = Date.now();
    const filename = `${ts}-${safeFilename(file.name)}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const diskPath = path.join(uploadsDir, filename);
    await fs.writeFile(diskPath, bytes);

    const url = `/uploads/${filename}`;
    const newId = randomBytes(16).toString("hex");
    await db.insert(schema.media).values({
      id: newId,
      filename,
      url,
      mime: file.type || "application/octet-stream",
      bytes: file.size,
      uploadedBy: session.user.id,
    });

    return NextResponse.json({ ok: true, mediaId: newId, url, filename });
  } catch (e) {
    console.error("[media upload]", e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
