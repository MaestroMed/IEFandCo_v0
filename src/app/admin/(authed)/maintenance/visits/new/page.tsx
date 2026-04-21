import { Topbar } from "@/components/admin/Topbar";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import { VisitForm } from "../VisitForm";
import { getSites, getTechnicians } from "../../queries";

interface SearchParams {
  siteId?: string;
  equipmentId?: string;
}

export default async function NewVisitPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const sites = await getSites();
  if (sites.length === 0) {
    redirect("/admin/maintenance/sites/new");
  }
  const technicians = await getTechnicians();
  const equipment = await db
    .select({ id: schema.equipment.id, siteId: schema.equipment.siteId, type: schema.equipment.type, label: schema.equipment.label })
    .from(schema.equipment)
    .orderBy(asc(schema.equipment.label));

  return (
    <>
      <Topbar
        title="Programmer une visite"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Maintenance", href: "/admin/maintenance" },
          { label: "Visites", href: "/admin/maintenance/visits" },
          { label: "Nouvelle" },
        ]}
      />
      <div className="p-8">
        <VisitForm
          sites={sites.map((s) => ({ id: s.id, clientName: s.clientName, label: s.label }))}
          equipment={equipment}
          technicians={technicians.map((t) => ({ id: t.id, name: t.name, role: t.role }))}
          initial={{ siteId: sp.siteId, equipmentId: sp.equipmentId }}
        />
      </div>
    </>
  );
}
