import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function getLeadWithEvents(leadId: string) {
  const lead = (await db.select().from(schema.leads).where(eq(schema.leads.id, leadId)).limit(1))[0];
  if (!lead) return null;
  const events = await db.select({
    event: schema.leadEvents,
    actor: { id: schema.users.id, name: schema.users.name, email: schema.users.email },
  })
    .from(schema.leadEvents)
    .leftJoin(schema.users, eq(schema.leadEvents.actorId, schema.users.id))
    .where(eq(schema.leadEvents.leadId, leadId))
    .orderBy(desc(schema.leadEvents.at));
  return { lead, events };
}
