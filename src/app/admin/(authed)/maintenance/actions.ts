"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function id() {
  return randomBytes(16).toString("hex");
}

/* ───────────── Zod schemas ───────────── */

const siteSchema = z.object({
  clientName: z.string().min(1).max(200),
  label: z.string().max(200).nullish(),
  address: z.string().min(1).max(500),
  city: z.string().max(120).nullish(),
  postalCode: z.string().max(20).nullish(),
  accessInstructions: z.string().max(4000).nullish(),
  contactName: z.string().max(200).nullish(),
  contactEmail: z.string().email().max(200).nullish().or(z.literal("").transform(() => null)),
  contactPhone: z.string().max(40).nullish(),
  notes: z.string().max(4000).nullish(),
});

const equipmentSchema = z.object({
  siteId: z.string().min(1).max(64),
  type: z.string().min(1).max(120),
  brand: z.string().max(120).nullish(),
  model: z.string().max(200).nullish(),
  serial: z.string().max(200).nullish(),
  installDate: z.number().int().nullish(),
  warrantyEnd: z.number().int().nullish(),
  label: z.string().max(200).nullish(),
  location: z.string().max(200).nullish(),
  notes: z.string().max(4000).nullish(),
  status: z.enum(["active", "faulty", "retired"]),
});

const visitSchema = z.object({
  equipmentId: z.string().max(64).nullish(),
  siteId: z.string().max(64).nullish(),
  scheduledFor: z.number().int(),
  technicianId: z.string().max(64).nullish(),
  type: z.enum(["preventive", "curative", "audit"]),
  status: z.enum(["scheduled", "in_progress", "done", "cancelled"]),
  reportMd: z.string().max(20000).nullish(),
  durationMinutes: z.number().int().min(0).max(100000).nullish(),
  notes: z.string().max(4000).nullish(),
});

const visitPartialSchema = visitSchema.partial();

const contractSchema = z.object({
  siteId: z.string().min(1).max(64),
  type: z.enum(["preventive", "full_service", "on_demand"]),
  startDate: z.number().int(),
  endDate: z.number().int().nullish(),
  slaHours: z.number().int().min(0).max(10000).nullish(),
  frequencyMonths: z.number().int().min(0).max(120),
  amountHt: z.number().int().nullish(),
  status: z.enum(["active", "expired", "pending"]),
  notes: z.string().max(4000).nullish(),
  generateVisits: z.boolean().optional(),
});

type SiteInput = z.infer<typeof siteSchema>;
type EquipmentInput = z.infer<typeof equipmentSchema>;
type VisitInput = z.infer<typeof visitSchema>;
type ContractInput = z.infer<typeof contractSchema>;

function invalidPayload(e: unknown): { ok: false; error: string } {
  if (e instanceof z.ZodError) {
    return { ok: false as const, error: "Donnees invalides" };
  }
  return { ok: false as const, error: (e as Error).message };
}

/* ───────────── Sites ───────────── */

export async function createSite(input: SiteInput) {
  await requireAdmin();
  try {
    const data = siteSchema.parse(input);
    const newId = id();
    await db.insert(schema.sites).values({
      id: newId,
      clientName: data.clientName,
      label: data.label || null,
      address: data.address,
      city: data.city || null,
      postalCode: data.postalCode || null,
      accessInstructions: data.accessInstructions || null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      notes: data.notes || null,
    });
    revalidatePath("/admin/maintenance/sites");
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function updateSite(siteId: string, input: SiteInput) {
  await requireAdmin();
  try {
    const data = siteSchema.parse(input);
    await db
      .update(schema.sites)
      .set({
        clientName: data.clientName,
        label: data.label || null,
        address: data.address,
        city: data.city || null,
        postalCode: data.postalCode || null,
        accessInstructions: data.accessInstructions || null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        notes: data.notes || null,
      })
      .where(eq(schema.sites.id, siteId));
    revalidatePath("/admin/maintenance/sites");
    revalidatePath(`/admin/maintenance/sites/${siteId}`);
    return { ok: true as const };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function deleteSite(siteId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.sites).where(eq(schema.sites.id, siteId));
    revalidatePath("/admin/maintenance/sites");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ───────────── Equipment ───────────── */

export async function createEquipment(input: EquipmentInput) {
  await requireAdmin();
  try {
    const data = equipmentSchema.parse(input);
    const newId = id();
    await db.insert(schema.equipment).values({
      id: newId,
      siteId: data.siteId,
      type: data.type,
      brand: data.brand || null,
      model: data.model || null,
      serial: data.serial || null,
      installDate: data.installDate ? new Date(data.installDate) : null,
      warrantyEnd: data.warrantyEnd ? new Date(data.warrantyEnd) : null,
      label: data.label || null,
      location: data.location || null,
      notes: data.notes || null,
      status: data.status,
    });
    revalidatePath("/admin/maintenance/equipment");
    revalidatePath(`/admin/maintenance/sites/${data.siteId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function updateEquipment(equipmentId: string, input: EquipmentInput) {
  await requireAdmin();
  try {
    const data = equipmentSchema.parse(input);
    await db
      .update(schema.equipment)
      .set({
        siteId: data.siteId,
        type: data.type,
        brand: data.brand || null,
        model: data.model || null,
        serial: data.serial || null,
        installDate: data.installDate ? new Date(data.installDate) : null,
        warrantyEnd: data.warrantyEnd ? new Date(data.warrantyEnd) : null,
        label: data.label || null,
        location: data.location || null,
        notes: data.notes || null,
        status: data.status,
      })
      .where(eq(schema.equipment.id, equipmentId));
    revalidatePath("/admin/maintenance/equipment");
    revalidatePath(`/admin/maintenance/equipment/${equipmentId}`);
    revalidatePath(`/admin/maintenance/sites/${data.siteId}`);
    return { ok: true as const };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function deleteEquipment(equipmentId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.equipment).where(eq(schema.equipment.id, equipmentId));
    revalidatePath("/admin/maintenance/equipment");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ───────────── Visits ───────────── */

export async function createVisit(input: VisitInput) {
  await requireAdmin();
  try {
    const data = visitSchema.parse(input);
    const newId = id();
    await db.insert(schema.maintenanceVisits).values({
      id: newId,
      equipmentId: data.equipmentId || null,
      siteId: data.siteId || null,
      scheduledFor: new Date(data.scheduledFor),
      technicianId: data.technicianId || null,
      type: data.type,
      status: data.status,
      reportMd: data.reportMd || null,
      durationMinutes: data.durationMinutes ?? null,
      notes: data.notes || null,
    });
    revalidatePath("/admin/maintenance/visits");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/maintenance");
    if (data.siteId) revalidatePath(`/admin/maintenance/sites/${data.siteId}`);
    if (data.equipmentId) revalidatePath(`/admin/maintenance/equipment/${data.equipmentId}`);
    return { ok: true as const, id: newId };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function updateVisit(visitId: string, input: Partial<VisitInput>) {
  await requireAdmin();
  try {
    const data = visitPartialSchema.parse(input);
    const set: Record<string, unknown> = {};
    if (data.equipmentId !== undefined) set.equipmentId = data.equipmentId || null;
    if (data.siteId !== undefined) set.siteId = data.siteId || null;
    if (data.scheduledFor !== undefined) set.scheduledFor = new Date(data.scheduledFor);
    if (data.technicianId !== undefined) set.technicianId = data.technicianId || null;
    if (data.type !== undefined) set.type = data.type;
    if (data.status !== undefined) set.status = data.status;
    if (data.reportMd !== undefined) set.reportMd = data.reportMd || null;
    if (data.durationMinutes !== undefined) set.durationMinutes = data.durationMinutes ?? null;
    if (data.notes !== undefined) set.notes = data.notes || null;

    await db.update(schema.maintenanceVisits).set(set).where(eq(schema.maintenanceVisits.id, visitId));
    revalidatePath("/admin/maintenance/visits");
    revalidatePath(`/admin/maintenance/visits/${visitId}`);
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function markVisitDone(visitId: string, durationMinutes?: number, reportMd?: string) {
  await requireAdmin();
  try {
    const set: Record<string, unknown> = {
      status: "done",
      doneAt: new Date(),
    };
    if (durationMinutes !== undefined) {
      const d = z.number().int().min(0).max(100000).safeParse(durationMinutes);
      if (!d.success) return { ok: false as const, error: "Donnees invalides" };
      set.durationMinutes = d.data;
    }
    if (reportMd !== undefined) {
      const r = z.string().max(20000).safeParse(reportMd);
      if (!r.success) return { ok: false as const, error: "Donnees invalides" };
      set.reportMd = r.data;
    }
    await db.update(schema.maintenanceVisits).set(set).where(eq(schema.maintenanceVisits.id, visitId));
    revalidatePath("/admin/maintenance/visits");
    revalidatePath(`/admin/maintenance/visits/${visitId}`);
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteVisit(visitId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.maintenanceVisits).where(eq(schema.maintenanceVisits.id, visitId));
    revalidatePath("/admin/maintenance/visits");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

/* ───────────── Contracts ───────────── */

export async function createContract(input: ContractInput) {
  await requireAdmin();
  try {
    const data = contractSchema.parse(input);
    const newId = id();
    const start = new Date(data.startDate);
    const end = data.endDate ? new Date(data.endDate) : null;

    await db.insert(schema.contracts).values({
      id: newId,
      siteId: data.siteId,
      type: data.type,
      startDate: start,
      endDate: end,
      slaHours: data.slaHours ?? null,
      frequencyMonths: data.frequencyMonths,
      amountHt: data.amountHt ?? null,
      status: data.status,
      notes: data.notes || null,
    });

    // Optionally generate planned visits
    if (data.generateVisits && data.type === "preventive" && data.frequencyMonths > 0) {
      const limit = end || new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
      let cur = new Date(start);
      // First visit at start + frequency
      cur = new Date(cur);
      cur.setMonth(cur.getMonth() + data.frequencyMonths);
      let safeguard = 0;
      while (cur <= limit && safeguard < 100) {
        await db.insert(schema.maintenanceVisits).values({
          id: id(),
          siteId: data.siteId,
          scheduledFor: new Date(cur),
          type: "preventive",
          status: "scheduled",
          notes: `Visite planifiee depuis le contrat ${newId.slice(0, 8)}`,
        });
        cur = new Date(cur);
        cur.setMonth(cur.getMonth() + data.frequencyMonths);
        safeguard++;
      }
    }

    revalidatePath("/admin/maintenance/contracts");
    revalidatePath(`/admin/maintenance/sites/${data.siteId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function updateContract(contractId: string, input: ContractInput) {
  await requireAdmin();
  try {
    const data = contractSchema.parse(input);
    await db
      .update(schema.contracts)
      .set({
        siteId: data.siteId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        slaHours: data.slaHours ?? null,
        frequencyMonths: data.frequencyMonths,
        amountHt: data.amountHt ?? null,
        status: data.status,
        notes: data.notes || null,
      })
      .where(eq(schema.contracts.id, contractId));
    revalidatePath("/admin/maintenance/contracts");
    revalidatePath(`/admin/maintenance/contracts/${contractId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return invalidPayload(e);
  }
}

export async function deleteContract(contractId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.contracts).where(eq(schema.contracts.id, contractId));
    revalidatePath("/admin/maintenance/contracts");
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
