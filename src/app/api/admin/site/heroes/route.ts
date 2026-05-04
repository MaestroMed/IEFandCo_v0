/**
 * Admin API — page hero overrides (per-page hero for static pages).
 *
 *  - POST   { key, enabled, eyebrow, title, intro, mediaId, objectPosition, opacity, overlayLeft }
 *           → upsert row in `page_heroes`.
 *  - DELETE { key } → drop the row, page falls back to its coded default hero.
 *
 * Both require an authenticated admin session. Audit logged.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { logAudit, shallowDiff } from "@/lib/admin/audit";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const upsertSchema = z.object({
  key: z.string().min(1).max(100),
  enabled: z.boolean().optional().default(true),
  eyebrow: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  intro: z.string().nullable().optional(),
  mediaId: z.string().nullable().optional(),
  objectPosition: z.string().optional().default("center 50%"),
  opacity: z.number().int().min(0).max(100).optional().default(100),
  overlayLeft: z.number().int().min(0).max(100).optional().default(70),
});

const deleteSchema = z.object({
  key: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const values = {
    enabled: data.enabled,
    eyebrow: data.eyebrow || null,
    title: data.title || null,
    intro: data.intro || null,
    mediaId: data.mediaId || null,
    objectPosition: data.objectPosition || "center 50%",
    opacity: data.opacity,
    overlayLeft: data.overlayLeft,
    updatedAt: new Date(),
  };

  try {
    const existing = (
      await db
        .select()
        .from(schema.pageHeroes)
        .where(eq(schema.pageHeroes.key, data.key))
        .limit(1)
    )[0];

    if (existing) {
      await db
        .update(schema.pageHeroes)
        .set(values)
        .where(eq(schema.pageHeroes.key, data.key));
    } else {
      await db.insert(schema.pageHeroes).values({ key: data.key, ...values });
    }

    await logAudit({
      userId: session.user.id,
      entity: "page_hero",
      entityId: data.key,
      action: "update",
      diff: shallowDiff(
        existing ? (existing as unknown as Record<string, unknown>) : null,
        { key: data.key, ...values } as Record<string, unknown>,
      ),
    });

    revalidatePath("/admin/site/heroes");
    revalidatePath(`/admin/site/heroes/${data.key}`);

    return NextResponse.json({ ok: true, key: data.key });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { key } = parsed.data;

  try {
    const existing = (
      await db
        .select()
        .from(schema.pageHeroes)
        .where(eq(schema.pageHeroes.key, key))
        .limit(1)
    )[0];

    if (!existing) {
      return NextResponse.json({ ok: true, key, alreadyEmpty: true });
    }

    await db.delete(schema.pageHeroes).where(eq(schema.pageHeroes.key, key));

    await logAudit({
      userId: session.user.id,
      entity: "page_hero",
      entityId: key,
      action: "reset",
      diff: shallowDiff(existing as unknown as Record<string, unknown>, null),
    });

    revalidatePath("/admin/site/heroes");
    revalidatePath(`/admin/site/heroes/${key}`);

    return NextResponse.json({ ok: true, key });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
