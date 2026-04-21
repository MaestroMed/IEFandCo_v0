import { db, schema } from "@/db";
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

export async function getSites() {
  return db.select().from(schema.sites).orderBy(desc(schema.sites.createdAt));
}

export async function getSiteById(id: string) {
  const rows = await db.select().from(schema.sites).where(eq(schema.sites.id, id)).limit(1);
  return rows[0] || null;
}

export async function getEquipmentForSite(siteId: string) {
  return db.select().from(schema.equipment).where(eq(schema.equipment.siteId, siteId)).orderBy(desc(schema.equipment.createdAt));
}

export async function getContractsForSite(siteId: string) {
  return db.select().from(schema.contracts).where(eq(schema.contracts.siteId, siteId)).orderBy(desc(schema.contracts.startDate));
}

export async function getVisitsForSite(siteId: string) {
  return db
    .select({
      visit: schema.maintenanceVisits,
      equipment: { id: schema.equipment.id, label: schema.equipment.label, type: schema.equipment.type },
    })
    .from(schema.maintenanceVisits)
    .leftJoin(schema.equipment, eq(schema.equipment.id, schema.maintenanceVisits.equipmentId))
    .where(eq(schema.maintenanceVisits.siteId, siteId))
    .orderBy(desc(schema.maintenanceVisits.scheduledFor));
}

export async function getEquipmentForEquipmentList() {
  return db
    .select({
      eq: schema.equipment,
      site: { id: schema.sites.id, label: schema.sites.label, clientName: schema.sites.clientName, city: schema.sites.city },
    })
    .from(schema.equipment)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.equipment.siteId))
    .orderBy(desc(schema.equipment.createdAt));
}

export async function getEquipmentById(id: string) {
  const rows = await db.select().from(schema.equipment).where(eq(schema.equipment.id, id)).limit(1);
  return rows[0] || null;
}

export async function getVisitsForEquipment(equipmentId: string) {
  return db
    .select()
    .from(schema.maintenanceVisits)
    .where(eq(schema.maintenanceVisits.equipmentId, equipmentId))
    .orderBy(desc(schema.maintenanceVisits.scheduledFor));
}

export async function getVisits(filters?: {
  status?: "scheduled" | "in_progress" | "done" | "cancelled";
  type?: "preventive" | "curative" | "audit";
  from?: Date;
  to?: Date;
}) {
  const where = [];
  if (filters?.status) where.push(eq(schema.maintenanceVisits.status, filters.status));
  if (filters?.type) where.push(eq(schema.maintenanceVisits.type, filters.type));
  if (filters?.from) where.push(gte(schema.maintenanceVisits.scheduledFor, filters.from));
  if (filters?.to) where.push(lte(schema.maintenanceVisits.scheduledFor, filters.to));

  return db
    .select({
      visit: schema.maintenanceVisits,
      site: { id: schema.sites.id, label: schema.sites.label, clientName: schema.sites.clientName },
      equipment: { id: schema.equipment.id, label: schema.equipment.label, type: schema.equipment.type },
      technician: { id: schema.users.id, name: schema.users.name },
    })
    .from(schema.maintenanceVisits)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.maintenanceVisits.siteId))
    .leftJoin(schema.equipment, eq(schema.equipment.id, schema.maintenanceVisits.equipmentId))
    .leftJoin(schema.users, eq(schema.users.id, schema.maintenanceVisits.technicianId))
    .where(where.length > 0 ? and(...where) : undefined)
    .orderBy(asc(schema.maintenanceVisits.scheduledFor));
}

export async function getVisitById(id: string) {
  const rows = await db
    .select({
      visit: schema.maintenanceVisits,
      site: schema.sites,
      equipment: schema.equipment,
      technician: { id: schema.users.id, name: schema.users.name, email: schema.users.email },
    })
    .from(schema.maintenanceVisits)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.maintenanceVisits.siteId))
    .leftJoin(schema.equipment, eq(schema.equipment.id, schema.maintenanceVisits.equipmentId))
    .leftJoin(schema.users, eq(schema.users.id, schema.maintenanceVisits.technicianId))
    .where(eq(schema.maintenanceVisits.id, id))
    .limit(1);
  return rows[0] || null;
}

export async function getContracts() {
  return db
    .select({
      contract: schema.contracts,
      site: { id: schema.sites.id, label: schema.sites.label, clientName: schema.sites.clientName, city: schema.sites.city },
    })
    .from(schema.contracts)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.contracts.siteId))
    .orderBy(desc(schema.contracts.startDate));
}

export async function getContractById(id: string) {
  const rows = await db.select().from(schema.contracts).where(eq(schema.contracts.id, id)).limit(1);
  return rows[0] || null;
}

export async function getTechnicians() {
  return db
    .select({ id: schema.users.id, name: schema.users.name, role: schema.users.role })
    .from(schema.users)
    .where(inArray(schema.users.role, ["admin", "owner", "technicien"]))
    .orderBy(asc(schema.users.name));
}

export async function getMaintenanceOverview() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    sitesC,
    equipmentC,
    visitsThisMonthC,
    contractsActiveC,
    overdueVisits,
    expiringContracts,
  ] = await Promise.all([
    db.select({ c: count() }).from(schema.sites),
    db.select({ c: count() }).from(schema.equipment),
    db
      .select({ c: count() })
      .from(schema.maintenanceVisits)
      .where(and(gte(schema.maintenanceVisits.scheduledFor, monthStart), lte(schema.maintenanceVisits.scheduledFor, monthEnd))),
    db.select({ c: count() }).from(schema.contracts).where(eq(schema.contracts.status, "active")),
    db
      .select({ c: count() })
      .from(schema.maintenanceVisits)
      .where(and(eq(schema.maintenanceVisits.status, "scheduled"), lte(schema.maintenanceVisits.scheduledFor, now))),
    db
      .select({ c: count() })
      .from(schema.contracts)
      .where(and(eq(schema.contracts.status, "active"), lte(schema.contracts.endDate, in30Days), gte(schema.contracts.endDate, now))),
  ]);

  return {
    sitesCount: sitesC[0].c,
    equipmentCount: equipmentC[0].c,
    visitsThisMonth: visitsThisMonthC[0].c,
    contractsActive: contractsActiveC[0].c,
    overdueVisits: overdueVisits[0].c,
    expiringContracts: expiringContracts[0].c,
  };
}

export async function getUpcomingVisits(days = 30) {
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return db
    .select({
      visit: schema.maintenanceVisits,
      site: { id: schema.sites.id, label: schema.sites.label, clientName: schema.sites.clientName },
      equipment: { id: schema.equipment.id, label: schema.equipment.label, type: schema.equipment.type },
      technician: { id: schema.users.id, name: schema.users.name },
    })
    .from(schema.maintenanceVisits)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.maintenanceVisits.siteId))
    .leftJoin(schema.equipment, eq(schema.equipment.id, schema.maintenanceVisits.equipmentId))
    .leftJoin(schema.users, eq(schema.users.id, schema.maintenanceVisits.technicianId))
    .where(and(gte(schema.maintenanceVisits.scheduledFor, now), lte(schema.maintenanceVisits.scheduledFor, end)))
    .orderBy(asc(schema.maintenanceVisits.scheduledFor))
    .limit(20);
}

export async function getEquipmentCountsBySite() {
  const rows = await db
    .select({ siteId: schema.equipment.siteId, c: sql<number>`count(*)` })
    .from(schema.equipment)
    .groupBy(schema.equipment.siteId);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.siteId] = Number(r.c);
  return map;
}

export async function getContractCountsBySite() {
  const rows = await db
    .select({ siteId: schema.contracts.siteId, c: sql<number>`count(*)` })
    .from(schema.contracts)
    .groupBy(schema.contracts.siteId);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.siteId] = Number(r.c);
  return map;
}

export async function getLastVisitByEquipment() {
  const rows = await db
    .select({
      equipmentId: schema.maintenanceVisits.equipmentId,
      lastDoneAt: sql<number | null>`max(${schema.maintenanceVisits.doneAt})`,
    })
    .from(schema.maintenanceVisits)
    .where(eq(schema.maintenanceVisits.status, "done"))
    .groupBy(schema.maintenanceVisits.equipmentId);
  const map: Record<string, Date | null> = {};
  for (const r of rows) {
    if (r.equipmentId && r.lastDoneAt) map[r.equipmentId] = new Date(r.lastDoneAt * 1000);
  }
  return map;
}
