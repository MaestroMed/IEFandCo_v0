"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

import { PERMISSION_STATUSES } from "./constants";

function id() {
  return randomBytes(16).toString("hex");
}

type Input = {
  name: string;
  website?: string | null;
  permissionStatus: (typeof PERMISSION_STATUSES)[number];
  visible?: boolean;
  orderIdx?: number;
  logoMediaId?: string | null;
};

export async function createClient(input: Input) {
  await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.clients).values({
      id: newId,
      name: input.name,
      website: input.website || null,
      permissionStatus: input.permissionStatus,
      visible: input.visible ?? true,
      orderIdx: input.orderIdx ?? 0,
      logoMediaId: input.logoMediaId || null,
    });
    revalidatePath("/admin/clients");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateClient(clientId: string, input: Input) {
  await requireAdmin();
  try {
    await db
      .update(schema.clients)
      .set({
        name: input.name,
        website: input.website || null,
        permissionStatus: input.permissionStatus,
        visible: input.visible ?? true,
        orderIdx: input.orderIdx ?? 0,
        logoMediaId: input.logoMediaId || null,
      })
      .where(eq(schema.clients.id, clientId));
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${clientId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteClient(clientId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.clients).where(eq(schema.clients.id, clientId));
    revalidatePath("/admin/clients");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
