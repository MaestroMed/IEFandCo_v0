/**
 * Audit log helper.
 *
 * Future PRs will call `logAudit` from server actions to track who did what.
 * For now, only the helper is exposed — viewers should not retrofit existing
 * actions automatically.
 */

import { db, schema } from "@/db";
import { randomBytes } from "node:crypto";

export interface AuditInput {
  userId: string | null;
  entity: string;
  entityId?: string | null;
  action: string; // create | update | delete | login | publish | ...
  diff?: unknown;
}

function id() {
  return randomBytes(16).toString("hex");
}

export async function logAudit(input: AuditInput) {
  try {
    await db.insert(schema.auditLog).values({
      id: id(),
      userId: input.userId,
      entity: input.entity,
      entityId: input.entityId || null,
      action: input.action,
      diffJson: input.diff !== undefined ? JSON.stringify(input.diff) : null,
    });
  } catch {
    // never throw from audit; logging is best-effort
  }
}

/**
 * Compute a shallow before/after diff for two objects.
 * Returns an object: { changed: { key: [before, after] } }.
 */
export function shallowDiff(before: Record<string, unknown> | null, after: Record<string, unknown> | null) {
  const changed: Record<string, [unknown, unknown]> = {};
  if (!before && !after) return { changed };
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const k of keys) {
    const a = before?.[k];
    const b = after?.[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changed[k] = [a, b];
    }
  }
  return { changed };
}
