"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { initialsOf } from "@/lib/admin/slug";

function id() {
  return randomBytes(16).toString("hex");
}

type Input = {
  name: string;
  role: string;
  expertise: string;
  initials?: string;
  orderIdx?: number;
  visible?: boolean;
  photoMediaId?: string | null;
};

export async function createTeamMember(input: Input) {
  const me = await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.teamMembers).values({
      id: newId,
      name: input.name,
      role: input.role,
      expertise: input.expertise,
      initials: input.initials || initialsOf(input.name),
      orderIdx: input.orderIdx ?? 0,
      visible: input.visible ?? true,
      photoMediaId: input.photoMediaId || null,
    });
    await logAudit({
      userId: me.id,
      entity: "team",
      entityId: newId,
      action: "create",
      diff: { name: input.name, role: input.role },
    });
    revalidatePath("/admin/team");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateTeamMember(memberId: string, input: Input) {
  const me = await requireAdmin();
  try {
    await db
      .update(schema.teamMembers)
      .set({
        name: input.name,
        role: input.role,
        expertise: input.expertise,
        initials: input.initials || initialsOf(input.name),
        orderIdx: input.orderIdx ?? 0,
        visible: input.visible ?? true,
        photoMediaId: input.photoMediaId || null,
      })
      .where(eq(schema.teamMembers.id, memberId));
    await logAudit({
      userId: me.id,
      entity: "team",
      entityId: memberId,
      action: "update",
      diff: { name: input.name, role: input.role },
    });
    revalidatePath("/admin/team");
    revalidatePath(`/admin/team/${memberId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteTeamMember(memberId: string) {
  const me = await requireAdmin();
  try {
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, memberId));
    await logAudit({
      userId: me.id,
      entity: "team",
      entityId: memberId,
      action: "delete",
    });
    revalidatePath("/admin/team");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
