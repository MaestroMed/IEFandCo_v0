"use server";

import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

function id() {
  return randomBytes(16).toString("hex");
}

type TemplateInput = {
  key: string;
  name: string;
  subject: string;
  bodyHtml: string;
  variables?: string | null;
};

export async function createTemplate(input: TemplateInput) {
  await requireAdmin();
  try {
    const newId = id();
    await db.insert(schema.emailTemplates).values({
      id: newId,
      key: input.key.trim(),
      name: input.name.trim(),
      subject: input.subject,
      bodyHtml: input.bodyHtml,
      variables: input.variables || null,
    });
    revalidatePath("/admin/emails/templates");
    return { ok: true as const, id: newId };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function updateTemplate(templateId: string, input: Omit<TemplateInput, "key">) {
  await requireAdmin();
  try {
    await db
      .update(schema.emailTemplates)
      .set({
        name: input.name.trim(),
        subject: input.subject,
        bodyHtml: input.bodyHtml,
        variables: input.variables || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.emailTemplates.id, templateId));
    revalidatePath("/admin/emails/templates");
    revalidatePath(`/admin/emails/templates/${templateId}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function deleteTemplate(templateId: string) {
  await requireAdmin();
  try {
    await db.delete(schema.emailTemplates).where(eq(schema.emailTemplates.id, templateId));
    revalidatePath("/admin/emails/templates");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
}
