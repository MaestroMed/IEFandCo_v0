import { db, schema } from "@/db";
import { and, eq, gte, lte } from "drizzle-orm";

export async function getCalendarEvents(from: Date, to: Date) {
  const visits = await db
    .select({
      visit: schema.maintenanceVisits,
      site: { id: schema.sites.id, clientName: schema.sites.clientName, label: schema.sites.label },
      equipment: { id: schema.equipment.id, label: schema.equipment.label, type: schema.equipment.type },
      technician: { id: schema.users.id, name: schema.users.name },
    })
    .from(schema.maintenanceVisits)
    .leftJoin(schema.sites, eq(schema.sites.id, schema.maintenanceVisits.siteId))
    .leftJoin(schema.equipment, eq(schema.equipment.id, schema.maintenanceVisits.equipmentId))
    .leftJoin(schema.users, eq(schema.users.id, schema.maintenanceVisits.technicianId))
    .where(and(gte(schema.maintenanceVisits.scheduledFor, from), lte(schema.maintenanceVisits.scheduledFor, to)));

  return visits.map((row) => ({
    id: row.visit.id,
    type: "visit" as const,
    title: row.equipment?.label || row.equipment?.type || row.site?.clientName || "Visite",
    subtitle: row.site?.clientName || "",
    site: row.site?.label || row.site?.clientName || null,
    technician: row.technician?.name || null,
    start: new Date(row.visit.scheduledFor).toISOString(),
    durationMinutes: row.visit.durationMinutes,
    status: row.visit.status,
    visitType: row.visit.type,
    href: `/admin/maintenance/visits/${row.visit.id}`,
  }));
}

export type CalendarEvent = Awaited<ReturnType<typeof getCalendarEvents>>[number];
