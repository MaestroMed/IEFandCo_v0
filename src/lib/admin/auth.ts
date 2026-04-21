/**
 * Admin authentication — cookie-based sessions + argon2 password hashing.
 *
 * Flow:
 *  - POST /api/admin/login → validates email+password, creates session row, sets cookie
 *  - Middleware reads cookie, validates session in DB, attaches user info
 *  - POST /api/admin/logout → deletes session + cookie
 */

import { db, schema } from "@/db";
import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { User } from "@/db/schema";

export const SESSION_COOKIE = "ief_admin_session";
const SESSION_DAYS = 30;

function cuid() {
  return randomBytes(16).toString("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return argonHash(password, { algorithm: 2 });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argonVerify(hash, password);
  } catch {
    return false;
  }
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = cuid();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(schema.sessions).values({ id: sessionId, userId, expiresAt });
  return sessionId;
}

export async function getSession(): Promise<{ user: User; sessionId: string } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const rows = await db
    .select({ session: schema.sessions, user: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, sessionId), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);

  if (rows.length === 0) return null;

  // Touch last seen
  await db
    .update(schema.users)
    .set({ lastSeenAt: new Date() })
    .where(eq(schema.users.id, rows[0].user.id));

  return { user: rows[0].user, sessionId };
}

export async function destroySession(sessionId: string): Promise<void> {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function requireAdmin(): Promise<User> {
  const s = await getSession();
  if (!s) {
    throw new Error("UNAUTHORIZED");
  }
  return s.user;
}

export function canEdit(user: User | null): boolean {
  return !!user && ["owner", "admin", "editor"].includes(user.role);
}

export function canDelete(user: User | null): boolean {
  return !!user && ["owner", "admin"].includes(user.role);
}

export function canManageTeam(user: User | null): boolean {
  return !!user && ["owner", "admin"].includes(user.role);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
