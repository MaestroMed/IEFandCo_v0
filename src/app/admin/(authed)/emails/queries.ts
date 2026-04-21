import { db, schema } from "@/db";
import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";

export async function getTemplates() {
  return db.select().from(schema.emailTemplates).orderBy(desc(schema.emailTemplates.updatedAt));
}

export async function getTemplateById(id: string) {
  const rows = await db.select().from(schema.emailTemplates).where(eq(schema.emailTemplates.id, id)).limit(1);
  return rows[0] || null;
}

export async function getTemplateByKey(key: string) {
  const rows = await db.select().from(schema.emailTemplates).where(eq(schema.emailTemplates.key, key)).limit(1);
  return rows[0] || null;
}

export async function getEmailLog(filters?: {
  status?: "sent" | "failed" | "queued";
  template?: string;
  from?: Date;
  to?: Date;
  q?: string;
}) {
  const where = [];
  if (filters?.status) where.push(eq(schema.emailLog.status, filters.status));
  if (filters?.template) where.push(eq(schema.emailLog.templateKey, filters.template));
  if (filters?.from) where.push(gte(schema.emailLog.sentAt, filters.from));
  if (filters?.to) where.push(lte(schema.emailLog.sentAt, filters.to));
  if (filters?.q) {
    const q = `%${filters.q.toLowerCase()}%`;
    where.push(
      or(
        like(sql`lower(${schema.emailLog.toAddress})`, q),
        like(sql`lower(${schema.emailLog.subject})`, q),
      )!
    );
  }

  return db
    .select({
      log: schema.emailLog,
      sentByUser: { id: schema.users.id, name: schema.users.name, email: schema.users.email },
    })
    .from(schema.emailLog)
    .leftJoin(schema.users, eq(schema.users.id, schema.emailLog.sentBy))
    .where(where.length > 0 ? and(...where) : undefined)
    .orderBy(desc(schema.emailLog.sentAt))
    .limit(200);
}

export async function getEmailLogById(id: string) {
  const rows = await db
    .select({
      log: schema.emailLog,
      sentByUser: { id: schema.users.id, name: schema.users.name, email: schema.users.email },
    })
    .from(schema.emailLog)
    .leftJoin(schema.users, eq(schema.users.id, schema.emailLog.sentBy))
    .where(eq(schema.emailLog.id, id))
    .limit(1);
  return rows[0] || null;
}
