/**
 * Notifications feed builder.
 *
 * Aggregates events from multiple sources into a single time-sorted list:
 *   - Recent leads (status=new, last 7 days)
 *   - Upcoming maintenance visits (next 7 days)
 *   - Recently published blog posts (last 30 days)
 *   - Audit log entries from other admins (last 14 days)
 *
 * "Last seen" timestamp per user is stored under the settings key
 * `notifications:last-seen:{userId}` as an ISO 8601 string.
 */

import { db, schema } from "@/db";
import { and, desc, eq, gte, lte, ne } from "drizzle-orm";
import { getSetting, setSetting } from "./settings";

export type NotificationKind = "lead" | "visit" | "blog" | "audit";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  at: Date;
  title: string;
  subtitle?: string;
  url: string;
}

const lastSeenKey = (userId: string) => `notifications:last-seen:${userId}`;

export async function getLastSeen(userId: string): Promise<Date | null> {
  const v = await getSetting<string>(lastSeenKey(userId));
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export async function markAllRead(userId: string): Promise<void> {
  await setSetting(lastSeenKey(userId), new Date().toISOString());
}

export async function getNotifications(userId: string, limit = 30): Promise<{
  items: NotificationItem[];
  unread: number;
  lastSeen: Date | null;
}> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const items: NotificationItem[] = [];

  try {
    // Recent new leads
    const leads = await db
      .select()
      .from(schema.leads)
      .where(and(eq(schema.leads.status, "new"), gte(schema.leads.receivedAt, sevenDaysAgo)))
      .orderBy(desc(schema.leads.receivedAt))
      .limit(20);
    for (const l of leads) {
      items.push({
        id: `lead:${l.id}`,
        kind: "lead",
        at: l.receivedAt,
        title: `Nouveau ${l.type === "devis" ? "devis" : "contact"} : ${l.firstName} ${l.lastName}`,
        subtitle: l.company || l.email,
        url: `/admin/leads/${l.id}`,
      });
    }
  } catch { /* table may be missing in dev */ }

  try {
    // Upcoming maintenance visits
    const visits = await db
      .select()
      .from(schema.maintenanceVisits)
      .where(
        and(
          gte(schema.maintenanceVisits.scheduledFor, now),
          lte(schema.maintenanceVisits.scheduledFor, sevenDaysAhead),
          eq(schema.maintenanceVisits.status, "scheduled"),
        ),
      )
      .orderBy(schema.maintenanceVisits.scheduledFor)
      .limit(10);
    for (const v of visits) {
      items.push({
        id: `visit:${v.id}`,
        kind: "visit",
        at: v.scheduledFor,
        title: `Visite ${v.type} programmee`,
        subtitle: v.notes || undefined,
        url: `/admin/maintenance/visits/${v.id}`,
      });
    }
  } catch { /* ignore */ }

  try {
    // Recently published blog
    const posts = await db
      .select()
      .from(schema.blogPosts)
      .where(and(eq(schema.blogPosts.status, "published"), gte(schema.blogPosts.publishedAt, thirtyDaysAgo)))
      .orderBy(desc(schema.blogPosts.publishedAt))
      .limit(5);
    for (const b of posts) {
      if (b.publishedAt) {
        items.push({
          id: `blog:${b.id}`,
          kind: "blog",
          at: b.publishedAt,
          title: `Article publie : ${b.title}`,
          subtitle: b.category,
          url: `/admin/blog/${b.id}`,
        });
      }
    }
  } catch { /* ignore */ }

  try {
    // Audit log from other admins
    const audits = await db
      .select({
        id: schema.auditLog.id,
        userId: schema.auditLog.userId,
        entity: schema.auditLog.entity,
        entityId: schema.auditLog.entityId,
        action: schema.auditLog.action,
        at: schema.auditLog.at,
        actorName: schema.users.name,
      })
      .from(schema.auditLog)
      .leftJoin(schema.users, eq(schema.auditLog.userId, schema.users.id))
      .where(and(ne(schema.auditLog.userId, userId), gte(schema.auditLog.at, fourteenDaysAgo)))
      .orderBy(desc(schema.auditLog.at))
      .limit(15);
    for (const a of audits) {
      items.push({
        id: `audit:${a.id}`,
        kind: "audit",
        at: a.at,
        title: `${a.actorName || "Admin"} a ${a.action} ${a.entity}`,
        subtitle: a.entityId ? `#${a.entityId.slice(0, 8)}` : undefined,
        url: "/admin/audit",
      });
    }
  } catch { /* ignore */ }

  items.sort((a, b) => b.at.getTime() - a.at.getTime());
  const trimmed = items.slice(0, limit);

  const lastSeen = await getLastSeen(userId);
  const unread = lastSeen
    ? trimmed.filter((it) => it.at > lastSeen).length
    : trimmed.length;

  return { items: trimmed, unread, lastSeen };
}
