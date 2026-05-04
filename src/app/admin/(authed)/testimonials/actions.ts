"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

function id() {
  return randomBytes(16).toString("hex");
}

type Input = {
  author: string;
  company?: string | null;
  quote: string;
  rating: number;
  visible?: boolean;
  orderIdx?: number;
  photoMediaId?: string | null;
};

export async function createTestimonial(input: Input) {
  const me = await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.testimonials).values({
      id: newId,
      author: input.author,
      company: input.company || null,
      quote: input.quote,
      rating: Math.min(5, Math.max(1, input.rating)),
      visible: input.visible ?? true,
      orderIdx: input.orderIdx ?? 0,
      photoMediaId: input.photoMediaId || null,
    });
    await logAudit({
      userId: me.id,
      entity: "testimonials",
      entityId: newId,
      action: "create",
      diff: { author: input.author, rating: input.rating },
    });
    revalidatePath("/admin/testimonials");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateTestimonial(testimonialId: string, input: Input) {
  const me = await requireAdmin();
  try {
    await db
      .update(schema.testimonials)
      .set({
        author: input.author,
        company: input.company || null,
        quote: input.quote,
        rating: Math.min(5, Math.max(1, input.rating)),
        visible: input.visible ?? true,
        orderIdx: input.orderIdx ?? 0,
        photoMediaId: input.photoMediaId || null,
      })
      .where(eq(schema.testimonials.id, testimonialId));
    await logAudit({
      userId: me.id,
      entity: "testimonials",
      entityId: testimonialId,
      action: "update",
      diff: { author: input.author, rating: input.rating },
    });
    revalidatePath("/admin/testimonials");
    revalidatePath(`/admin/testimonials/${testimonialId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteTestimonial(testimonialId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, testimonialId));
    await logAudit({
      userId: me.id,
      entity: "testimonials",
      entityId: testimonialId,
      action: "delete",
    });
    revalidatePath("/admin/testimonials");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
