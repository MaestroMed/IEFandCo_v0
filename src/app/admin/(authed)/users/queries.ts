import { db, schema } from "@/db";
import { eq, asc, desc, gt } from "drizzle-orm";

export async function getUsers() {
  return db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      avatar: schema.users.avatar,
      lastSeenAt: schema.users.lastSeenAt,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .orderBy(asc(schema.users.name));
}

export async function getUserById(id: string) {
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  return rows[0] || null;
}

export async function getUserSessions(userId: string) {
  return db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.userId, userId))
    .orderBy(desc(schema.sessions.createdAt));
}

export async function getActiveSessionsCount(userId: string) {
  const rows = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.userId, userId));
  const now = new Date();
  return rows.filter((r) => r.expiresAt > now).length;
}

export async function getActiveSessionsCountByUser(): Promise<Record<string, number>> {
  const rows = await db
    .select({ userId: schema.sessions.userId, expiresAt: schema.sessions.expiresAt })
    .from(schema.sessions)
    .where(gt(schema.sessions.expiresAt, new Date()));
  const map: Record<string, number> = {};
  for (const r of rows) {
    map[r.userId] = (map[r.userId] || 0) + 1;
  }
  return map;
}
