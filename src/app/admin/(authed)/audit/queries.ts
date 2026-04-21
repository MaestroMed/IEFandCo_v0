import { db, schema } from "@/db";
import { and, desc, eq, gte, lte, count, asc, sql } from "drizzle-orm";

export interface AuditFilters {
  userId?: string;
  entity?: string;
  action?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

export async function getAuditEntries(filters: AuditFilters = {}) {
  const where = [];
  if (filters.userId) where.push(eq(schema.auditLog.userId, filters.userId));
  if (filters.entity) where.push(eq(schema.auditLog.entity, filters.entity));
  if (filters.action) where.push(eq(schema.auditLog.action, filters.action));
  if (filters.from) where.push(gte(schema.auditLog.at, filters.from));
  if (filters.to) where.push(lte(schema.auditLog.at, filters.to));

  const whereClause = where.length > 0 ? and(...where) : undefined;
  const pageSize = filters.pageSize ?? 50;
  const page = filters.page ?? 1;
  const offset = (page - 1) * pageSize;

  const [entries, totalRows] = await Promise.all([
    db
      .select({
        entry: schema.auditLog,
        actor: { id: schema.users.id, name: schema.users.name, email: schema.users.email },
      })
      .from(schema.auditLog)
      .leftJoin(schema.users, eq(schema.users.id, schema.auditLog.userId))
      .where(whereClause)
      .orderBy(desc(schema.auditLog.at))
      .limit(pageSize)
      .offset(offset),
    db.select({ c: count() }).from(schema.auditLog).where(whereClause),
  ]);

  return {
    entries,
    total: totalRows[0].c,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalRows[0].c / pageSize)),
  };
}

export async function getAuditFilterChoices() {
  const [users, entities, actions] = await Promise.all([
    db
      .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email })
      .from(schema.users)
      .orderBy(asc(schema.users.name)),
    db
      .select({ entity: schema.auditLog.entity, c: sql<number>`count(*)` })
      .from(schema.auditLog)
      .groupBy(schema.auditLog.entity),
    db
      .select({ action: schema.auditLog.action, c: sql<number>`count(*)` })
      .from(schema.auditLog)
      .groupBy(schema.auditLog.action),
  ]);
  return {
    users,
    entities: entities.map((e) => e.entity).filter(Boolean),
    actions: actions.map((a) => a.action).filter(Boolean),
  };
}
