"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { setSetting } from "@/lib/admin/settings";
import { revalidatePath } from "next/cache";

export async function updateRobotsTxt(content: string) {
  await requireAdmin();
  try {
    await setSetting("seo:robots-txt", content);
    revalidatePath("/admin/seo/sitemap");
    revalidatePath("/admin/seo");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function regenerateSitemap() {
  await requireAdmin();
  // Stub: Next.js sitemap.ts is on-demand. We touch the path so the next
  // request rebuilds it. Real regeneration would warm the route.
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/seo/sitemap");
  return { ok: true as const };
}
