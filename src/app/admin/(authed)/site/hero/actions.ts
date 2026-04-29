"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const HERO_ID = "default";

const heroSchema = z.object({
  enabled: z.boolean().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryHref: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryHref: z.string().optional(),
  mediaId: z.string().optional(),
  posterMediaId: z.string().optional(),
  overlayOpacity: z.number().int().min(0).max(100).optional(),
});

export type HeroInput = z.infer<typeof heroSchema>;

export async function saveHero(input: HeroInput) {
  await requireAdmin();
  try {
    const parsed = heroSchema.parse(input);
    const existing = await db
      .select({ id: schema.homepageHero.id })
      .from(schema.homepageHero)
      .where(eq(schema.homepageHero.id, HERO_ID))
      .limit(1);

    const values = {
      enabled: !!parsed.enabled,
      eyebrow: parsed.eyebrow || null,
      title: parsed.title || null,
      subtitle: parsed.subtitle || null,
      ctaPrimaryLabel: parsed.ctaPrimaryLabel || null,
      ctaPrimaryHref: parsed.ctaPrimaryHref || null,
      ctaSecondaryLabel: parsed.ctaSecondaryLabel || null,
      ctaSecondaryHref: parsed.ctaSecondaryHref || null,
      mediaId: parsed.mediaId || null,
      posterMediaId: parsed.posterMediaId || null,
      overlayOpacity: typeof parsed.overlayOpacity === "number" ? parsed.overlayOpacity : 50,
      updatedAt: new Date(),
    };

    if (existing.length === 0) {
      await db.insert(schema.homepageHero).values({ id: HERO_ID, ...values });
    } else {
      await db.update(schema.homepageHero).set(values).where(eq(schema.homepageHero.id, HERO_ID));
    }

    revalidatePath("/admin/site/hero");
    revalidatePath("/");
    return { ok: true as const, id: HERO_ID };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
