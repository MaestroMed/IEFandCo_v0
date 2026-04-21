"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { setMany, setSetting } from "@/lib/admin/settings";
import { revalidatePath } from "next/cache";
import { NAV_KEY } from "./constants";

export async function updateGeneral(values: Record<string, string>) {
  await requireAdmin();
  try {
    await setMany(values);
    revalidatePath("/admin/settings/general");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateBranding(values: Record<string, string>) {
  await requireAdmin();
  try {
    await setMany(values);
    revalidatePath("/admin/settings/branding");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateIntegrations(values: Record<string, string | boolean>) {
  await requireAdmin();
  try {
    await setMany(values);
    revalidatePath("/admin/settings/integrations");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateLegal(values: { mentions: string; privacy: string }) {
  await requireAdmin();
  try {
    await setMany({
      "legal:mentions": values.mentions,
      "legal:privacy": values.privacy,
    });
    revalidatePath("/admin/settings/legal");
    revalidatePath("/mentions-legales");
    revalidatePath("/politique-confidentialite");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

interface NavInput {
  label: string;
  href: string;
  children?: NavInput[];
}

export async function updateNavigation(items: NavInput[]) {
  await requireAdmin();
  try {
    // Sanitize: strip empty entries, ensure shape
    const clean = (arr: NavInput[]): NavInput[] =>
      arr
        .map((it) => ({
          label: (it.label || "").trim(),
          href: (it.href || "").trim(),
          children: it.children && it.children.length > 0 ? clean(it.children) : undefined,
        }))
        .filter((it) => it.label && it.href);
    await setSetting(NAV_KEY, clean(items));
    revalidatePath("/admin/settings/navigation");
    revalidatePath("/");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
