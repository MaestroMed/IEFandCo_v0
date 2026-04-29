"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const seoSchema = z.object({
  key: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  ogMediaId: z.string().optional(),
});

export type PageSeoInput = z.infer<typeof seoSchema>;

export async function savePageSeo(input: PageSeoInput) {
  await requireAdmin();
  try {
    const parsed = seoSchema.parse(input);
    const existing = await db
      .select({ key: schema.pageSeo.key })
      .from(schema.pageSeo)
      .where(eq(schema.pageSeo.key, parsed.key))
      .limit(1);

    const values = {
      title: parsed.title || null,
      description: parsed.description || null,
      ogMediaId: parsed.ogMediaId || null,
      updatedAt: new Date(),
    };

    if (existing.length === 0) {
      await db.insert(schema.pageSeo).values({ key: parsed.key, ...values });
    } else {
      await db.update(schema.pageSeo).set(values).where(eq(schema.pageSeo.key, parsed.key));
    }

    revalidatePath("/admin/site/page-seo");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deletePageSeo(key: string) {
  await requireAdmin();
  try {
    await db.delete(schema.pageSeo).where(eq(schema.pageSeo.key, key));
    revalidatePath("/admin/site/page-seo");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
