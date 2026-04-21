"use server";

import { db, schema } from "@/db";
import { canManageTeam, hashPassword, requireAdmin } from "@/lib/admin/auth";
import { setSetting, deleteSetting } from "@/lib/admin/settings";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { USER_ROLES, type UserRole } from "./constants";
import { generateTempPassword } from "./password";

function id() {
  return randomBytes(16).toString("hex");
}

export async function createUser(input: {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  try {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.name.trim()) return { ok: false as const, error: "Email et nom requis" };
    if (!USER_ROLES.includes(input.role)) return { ok: false as const, error: "Role invalide" };
    if (!input.password || input.password.length < 8) {
      return { ok: false as const, error: "Mot de passe trop court (min 8)" };
    }
    const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existing.length > 0) return { ok: false as const, error: "Email deja utilise" };

    const newId = id();
    const passwordHash = await hashPassword(input.password);
    await db.insert(schema.users).values({
      id: newId,
      email,
      name: input.name.trim(),
      role: input.role,
      passwordHash,
    });
    await setSetting(`user-mustchange:${newId}`, true);
    revalidatePath("/admin/users");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateUser(userId: string, input: { name: string; role: UserRole }) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  try {
    if (!USER_ROLES.includes(input.role)) return { ok: false as const, error: "Role invalide" };
    if (!input.name.trim()) return { ok: false as const, error: "Nom requis" };
    await db
      .update(schema.users)
      .set({ name: input.name.trim(), role: input.role })
      .where(eq(schema.users.id, userId));
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function changeUserRole(userId: string, role: UserRole) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  try {
    if (!USER_ROLES.includes(role)) return { ok: false as const, error: "Role invalide" };
    await db.update(schema.users).set({ role }).where(eq(schema.users.id, userId));
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function resetUserPassword(userId: string) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  try {
    const tmpPassword = generateTempPassword();
    const passwordHash = await hashPassword(tmpPassword);
    await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, userId));
    await setSetting(`user-mustchange:${userId}`, true);
    // Revoke all existing sessions to force re-login
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { ok: true as const, tempPassword: tmpPassword };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteUser(userId: string) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  if (me.id === userId) return { ok: false as const, error: "Impossible de se supprimer soi-meme" };
  try {
    await db.delete(schema.users).where(eq(schema.users.id, userId));
    await deleteSetting(`user-mustchange:${userId}`);
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function revokeSession(sessionId: string) {
  const me = await requireAdmin();
  if (!canManageTeam(me)) return { ok: false as const, error: "Acces refuse" };
  try {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
    revalidatePath("/admin/users");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

