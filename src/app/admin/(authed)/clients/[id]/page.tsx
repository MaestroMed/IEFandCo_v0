import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ClientForm } from "../ClientForm";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.clients).where(eq(schema.clients.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const c = rows[0];

  return (
    <>
      <Topbar
        title={c.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Clients", href: "/admin/clients" },
          { label: c.name },
        ]}
      />
      <div className="p-8">
        <ClientForm
          clientId={c.id}
          initial={{
            name: c.name,
            website: c.website || "",
            permissionStatus: c.permissionStatus,
            visible: c.visible,
            orderIdx: String(c.orderIdx),
            logoMediaId: c.logoMediaId || "",
          }}
        />
      </div>
    </>
  );
}
