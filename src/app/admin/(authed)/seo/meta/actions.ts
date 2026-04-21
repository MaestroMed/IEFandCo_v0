"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { setSeoOverride } from "@/lib/admin/seo-override";
import { revalidatePath } from "next/cache";

export async function updateStaticSeo(key: string, title: string, description: string) {
  await requireAdmin();
  try {
    await setSeoOverride(key, {
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    });
    revalidatePath("/admin/seo");
    revalidatePath("/admin/seo/meta");
    revalidatePath(`/admin/seo/meta/${key}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
