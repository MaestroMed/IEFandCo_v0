"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

function id() {
  return randomBytes(16).toString("hex");
}

function normalizePath(p: string): string {
  const trimmed = p.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

interface Input {
  fromPath: string;
  toPath: string;
  statusCode: number;
}

export async function createRedirect(input: Input) {
  await requireAdmin();
  try {
    const fromPath = normalizePath(input.fromPath);
    const toPath = normalizePath(input.toPath);
    if (!fromPath || !toPath) return { ok: false as const, error: "From et to requis" };
    if (![301, 302, 307, 308].includes(input.statusCode)) {
      return { ok: false as const, error: "Code de status invalide" };
    }
    const existing = await db
      .select({ id: schema.redirects.id })
      .from(schema.redirects)
      .where(eq(schema.redirects.fromPath, fromPath))
      .limit(1);
    if (existing.length > 0) {
      return { ok: false as const, error: "Une redirection existe deja pour ce chemin" };
    }
    const newId = id();
    await db.insert(schema.redirects).values({
      id: newId,
      fromPath,
      toPath,
      statusCode: input.statusCode,
    });
    revalidatePath("/admin/seo/redirects");
    revalidatePath("/admin/seo");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateRedirect(redirectId: string, input: Input) {
  await requireAdmin();
  try {
    const fromPath = normalizePath(input.fromPath);
    const toPath = normalizePath(input.toPath);
    if (!fromPath || !toPath) return { ok: false as const, error: "From et to requis" };
    if (![301, 302, 307, 308].includes(input.statusCode)) {
      return { ok: false as const, error: "Code de status invalide" };
    }
    await db
      .update(schema.redirects)
      .set({ fromPath, toPath, statusCode: input.statusCode })
      .where(eq(schema.redirects.id, redirectId));
    revalidatePath("/admin/seo/redirects");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteRedirect(redirectId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.redirects).where(eq(schema.redirects.id, redirectId));
    await logAudit({
      userId: me.id,
      entity: "redirects",
      entityId: redirectId,
      action: "delete",
    });
    revalidatePath("/admin/seo/redirects");
    revalidatePath("/admin/seo");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function importRedirectsCsv(csv: string) {
  const me = await requireAdmin();
  try {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Wrap all inserts in a single transaction so a failure mid-batch
    // rolls back the whole import (no partial commits).
    await db.transaction(async (tx) => {
      for (const line of lines) {
        const parts = line.split(",").map((p) => p.trim());
        if (parts.length < 2) {
          skipped++;
          continue;
        }
        const fromPath = normalizePath(parts[0]);
        const toPath = normalizePath(parts[1]);
        const statusCode = parts[2] ? Number(parts[2]) : 301;
        if (!fromPath || !toPath) {
          skipped++;
          continue;
        }
        if (![301, 302, 307, 308].includes(statusCode)) {
          errors.push(`Ligne ignoree (status invalide): ${line}`);
          skipped++;
          continue;
        }
        const existing = await tx
          .select({ id: schema.redirects.id })
          .from(schema.redirects)
          .where(eq(schema.redirects.fromPath, fromPath))
          .limit(1);
        if (existing.length > 0) {
          skipped++;
          continue;
        }
        await tx.insert(schema.redirects).values({
          id: id(),
          fromPath,
          toPath,
          statusCode,
        });
        imported++;
      }
    });

    await logAudit({
      userId: me.id,
      entity: "redirects",
      action: "redirects.import",
      diff: { imported, skipped, errorCount: errors.length },
    });
    revalidatePath("/admin/seo/redirects");
    revalidatePath("/admin/seo");
    return { ok: true as const, imported, skipped, errors };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
