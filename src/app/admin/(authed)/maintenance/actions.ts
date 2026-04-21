"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

function id() {
  return randomBytes(16).toString("hex");
}

/* ───────────── Sites ───────────── */

type SiteInput = {
  clientName: string;
  label?: string | null;
  address: string;
  city?: string | null;
  postalCode?: string | null;
  accessInstructions?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  notes?: string | null;
};

export async function createSite(input: SiteInput) {
  await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.sites).values({
      id: newId,
      clientName: input.clientName,
      label: input.label || null,
      address: input.address,
      city: input.city || null,
      postalCode: input.postalCode || null,
      accessInstructions: input.accessInstructions || null,
      contactName: input.contactName || null,
      contactEmail: input.contactEmail || null,
      contactPhone: input.contactPhone || null,
      notes: input.notes || null,
    });
    revalidatePath("/admin/maintenance/sites");
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateSite(siteId: string, input: SiteInput) {
  await requireAdmin();
  try {
    await db
      .update(schema.sites)
      .set({
        clientName: input.clientName,
        label: input.label || null,
        address: input.address,
        city: input.city || null,
        postalCode: input.postalCode || null,
        accessInstructions: input.accessInstructions || null,
        contactName: input.contactName || null,
        contactEmail: input.contactEmail || null,
        contactPhone: input.contactPhone || null,
        notes: input.notes || null,
      })
      .where(eq(schema.sites.id, siteId));
    revalidatePath("/admin/maintenance/sites");
    revalidatePath(`/admin/maintenance/sites/${siteId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
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

type EquipmentInput = {
  siteId: string;
  type: string;
  brand?: string | null;
  model?: string | null;
  serial?: string | null;
  installDate?: number | null;
  warrantyEnd?: number | null;
  label?: string | null;
  location?: string | null;
  notes?: string | null;
  status: "active" | "faulty" | "retired";
};

export async function createEquipment(input: EquipmentInput) {
  await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.equipment).values({
      id: newId,
      siteId: input.siteId,
      type: input.type,
      brand: input.brand || null,
      model: input.model || null,
      serial: input.serial || null,
      installDate: input.installDate ? new Date(input.installDate) : null,
      warrantyEnd: input.warrantyEnd ? new Date(input.warrantyEnd) : null,
      label: input.label || null,
      location: input.location || null,
      notes: input.notes || null,
      status: input.status,
    });
    revalidatePath("/admin/maintenance/equipment");
    revalidatePath(`/admin/maintenance/sites/${input.siteId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateEquipment(equipmentId: string, input: EquipmentInput) {
  await requireAdmin();
  try {
    await db
      .update(schema.equipment)
      .set({
        siteId: input.siteId,
        type: input.type,
        brand: input.brand || null,
        model: input.model || null,
        serial: input.serial || null,
        installDate: input.installDate ? new Date(input.installDate) : null,
        warrantyEnd: input.warrantyEnd ? new Date(input.warrantyEnd) : null,
        label: input.label || null,
        location: input.location || null,
        notes: input.notes || null,
        status: input.status,
      })
      .where(eq(schema.equipment.id, equipmentId));
    revalidatePath("/admin/maintenance/equipment");
    revalidatePath(`/admin/maintenance/equipment/${equipmentId}`);
    revalidatePath(`/admin/maintenance/sites/${input.siteId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
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

type VisitInput = {
  equipmentId?: string | null;
  siteId?: string | null;
  scheduledFor: number;
  technicianId?: string | null;
  type: "preventive" | "curative" | "audit";
  status: "scheduled" | "in_progress" | "done" | "cancelled";
  reportMd?: string | null;
  durationMinutes?: number | null;
  notes?: string | null;
};

export async function createVisit(input: VisitInput) {
  await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.maintenanceVisits).values({
      id: newId,
      equipmentId: input.equipmentId || null,
      siteId: input.siteId || null,
      scheduledFor: new Date(input.scheduledFor),
      technicianId: input.technicianId || null,
      type: input.type,
      status: input.status,
      reportMd: input.reportMd || null,
      durationMinutes: input.durationMinutes ?? null,
      notes: input.notes || null,
    });
    revalidatePath("/admin/maintenance/visits");
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/maintenance");
    if (input.siteId) revalidatePath(`/admin/maintenance/sites/${input.siteId}`);
    if (input.equipmentId) revalidatePath(`/admin/maintenance/equipment/${input.equipmentId}`);
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateVisit(visitId: string, input: Partial<VisitInput>) {
  await requireAdmin();
  try {
    const set: Record<string, unknown> = {};
    if (input.equipmentId !== undefined) set.equipmentId = input.equipmentId || null;
    if (input.siteId !== undefined) set.siteId = input.siteId || null;
    if (input.scheduledFor !== undefined) set.scheduledFor = new Date(input.scheduledFor);
    if (input.technicianId !== undefined) set.technicianId = input.technicianId || null;
    if (input.type !== undefined) set.type = input.type;
    if (input.status !== undefined) set.status = input.status;
    if (input.reportMd !== undefined) set.reportMd = input.reportMd || null;
    if (input.durationMinutes !== undefined) set.durationMinutes = input.durationMinutes ?? null;
    if (input.notes !== undefined) set.notes = input.notes || null;

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

export async function markVisitDone(visitId: string, durationMinutes?: number, reportMd?: string) {
  await requireAdmin();
  try {
    const set: Record<string, unknown> = {
      status: "done",
      doneAt: new Date(),
    };
    if (durationMinutes !== undefined) set.durationMinutes = durationMinutes;
    if (reportMd !== undefined) set.reportMd = reportMd;
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

type ContractInput = {
  siteId: string;
  type: "preventive" | "full_service" | "on_demand";
  startDate: number;
  endDate?: number | null;
  slaHours?: number | null;
  frequencyMonths: number;
  amountHt?: number | null;
  status: "active" | "expired" | "pending";
  notes?: string | null;
  generateVisits?: boolean;
};

export async function createContract(input: ContractInput) {
  await requireAdmin();
  try {
    const newId = id();
    const start = new Date(input.startDate);
    const end = input.endDate ? new Date(input.endDate) : null;

    await db.insert(schema.contracts).values({
      id: newId,
      siteId: input.siteId,
      type: input.type,
      startDate: start,
      endDate: end,
      slaHours: input.slaHours ?? null,
      frequencyMonths: input.frequencyMonths,
      amountHt: input.amountHt ?? null,
      status: input.status,
      notes: input.notes || null,
    });

    // Optionally generate planned visits
    if (input.generateVisits && input.type === "preventive" && input.frequencyMonths > 0) {
      const limit = end || new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
      let cur = new Date(start);
      // First visit at start + frequency
      cur = new Date(cur);
      cur.setMonth(cur.getMonth() + input.frequencyMonths);
      let safeguard = 0;
      while (cur <= limit && safeguard < 100) {
        await db.insert(schema.maintenanceVisits).values({
          id: id(),
          siteId: input.siteId,
          scheduledFor: new Date(cur),
          type: "preventive",
          status: "scheduled",
          notes: `Visite planifiee depuis le contrat ${newId.slice(0, 8)}`,
        });
        cur = new Date(cur);
        cur.setMonth(cur.getMonth() + input.frequencyMonths);
        safeguard++;
      }
    }

    revalidatePath("/admin/maintenance/contracts");
    revalidatePath(`/admin/maintenance/sites/${input.siteId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateContract(contractId: string, input: ContractInput) {
  await requireAdmin();
  try {
    await db
      .update(schema.contracts)
      .set({
        siteId: input.siteId,
        type: input.type,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        slaHours: input.slaHours ?? null,
        frequencyMonths: input.frequencyMonths,
        amountHt: input.amountHt ?? null,
        status: input.status,
        notes: input.notes || null,
      })
      .where(eq(schema.contracts.id, contractId));
    revalidatePath("/admin/maintenance/contracts");
    revalidatePath(`/admin/maintenance/contracts/${contractId}`);
    revalidatePath("/admin/maintenance");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
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
